import axios from "axios";
import { execFile } from "child_process";
import * as admin from "firebase-admin";

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { promisify } from "util";

admin.initializeApp();
export const onReactionCreated = onDocumentCreated(
  "reactions/{reactionId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const { title, requested, user } = data;

    console.log("Raw data:", JSON.stringify(data, null, 2));

    if (!title) {
      console.error("Missing title document");
      return;
    }
    if (!requested) {
      console.error("Missing requested document");
      return;
    }

    if (!user) {
      console.error("Missing user document");
      return;
    }

    console.log(
      `New reaction created: ${snap.id} for user: ${user}, title: ${title}`
    );

    //get user token_fcm from firestore using var user
    const userSnap = await admin
      .firestore()
      .collection("users")
      .doc(user)
      .get();
    if (!userSnap.exists) {
      console.error(`User document not found for user: ${user}`);
      return;
    }
    const userData = userSnap.data();
    if (!userData || !userData.fcm_token) {
      console.error(`No FCM token found for user: ${user}`);
      return;
    }

    const message: admin.messaging.Message = {
      token: userData.fcm_token,
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body: `New reaction: ${title}`,
            },
            sound: "default",
          },
        },
      },
      notification: {
        title,
        body: `New reaction: ${title}`,
      },
      data: {
        reaction: snap.id,
      },
      webpush: {
        notification: {},
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Push notification sent:", response);
    } catch (error) {
      console.error("Error sending FCM message:", error);
    }
  }
);

const bucket = admin.storage().bucket();
const execFileAsync = promisify(execFile);

export const runFFmpeg = onCall(
  {
    memory: "1GiB",
    timeoutSeconds: 120,
  },
  async (request: { data: { video1Url: any; video2Url: any } }) => {
    const { video1Url, video2Url } = request.data;

    if (!video1Url || !video2Url) {
      throw new HttpsError("invalid-argument", "Missing video URLs.");
    }

    const tempDir = os.tmpdir();
    const video1Path = path.join(tempDir, "video1.mp4");
    const video2Path = path.join(tempDir, "video2.mp4");
    const outputPath = path.join(tempDir, `output-${Date.now()}.mp4`);

    const downloadFile = async (url: string, dest: string) => {
      const writer = fs.createWriteStream(dest);
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });
      return new Promise<void>((resolve, reject) => {
        (response.data as NodeJS.ReadableStream).pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    };

    try {
      await downloadFile(video1Url, video1Path);
      await downloadFile(video2Url, video2Path);

      const ffmpegPath = path.join(__dirname, "ffmpeg", "ffmpeg");

      const ffmpegArgs = [
        "-i",
        video1Path,
        "-i",
        video2Path,
        "-filter_complex",
        "[0:v]scale=1080:720:flags=bilinear[top];" +
          "[1:v]scale=1080:720:flags=bilinear[bottom];" +
          "color=black:size=1080x20:duration=0.1[gap];" +
          "[top][gap][bottom]vstack=inputs=3:shortest=0[outv];" +
          "[0:a][1:a]amix=inputs=2:duration=shortest[outa]",
        "-map",
        "[outv]",
        "-map",
        "[outa]",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-tune",
        "zerolatency",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-threads",
        "0",
        "-f",
        "mp4",
        outputPath,
      ];

      await execFileAsync(ffmpegPath, ffmpegArgs);

      const destPath = `processed/output-${Date.now()}.mp4`;
      const [file] = await bucket.upload(outputPath, {
        destination: destPath,
        metadata: { contentType: "video/mp4" },
      });

      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 12,
      });

      // Clean up temp files
      fs.unlinkSync(video1Path);
      fs.unlinkSync(video2Path);
      fs.unlinkSync(outputPath);

      return { videoUrl: signedUrl };
    } catch (error: any) {
      console.error("FFmpeg processing error:", error);
      throw new HttpsError(
        "internal",
        "Processing failed",
        error.message || error.toString()
      );
    }
  }
);
