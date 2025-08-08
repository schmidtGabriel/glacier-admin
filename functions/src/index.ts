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
    const { title, requested, user, status } = data;
    var pushTitle = data.title || "New Reaction";
    var pushBody = "";

    if (status == -1) {
      console.log("Reaction is on hold, skipping notification.");
      return;
    }

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

    const userRequestedSnap = await admin
      .firestore()
      .collection("users")
      .doc(requested)
      .get();
    if (userRequestedSnap.exists) {
      const userRequestedData = userRequestedSnap.data();
      if (userRequestedData && userRequestedData.name) {
        pushBody = `${userRequestedData.name} invited you to react`;
      }
    }

    const message: admin.messaging.Message = {
      token: userData.fcm_token,
      apns: {
        payload: {
          aps: {
            alert: {
              title: pushTitle,
              body: pushBody || `You're invited to react`,
            },
            sound: "default",
          },
        },
      },
      notification: {
        title: pushTitle,
        body: pushBody || `You're invited to react`,
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

export const onFriendInvitationCreated = onDocumentCreated(
  "friend_invitations/{invitationId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const { invited_to, invited_user, requested_user } = data;

    console.log("Raw data:", JSON.stringify(data, null, 2));

    if (!invited_to) {
      console.error("Missing invited_to document");
      return;
    }
    if (!invited_user) {
      console.error("Missing invited_user document");
      return;
    }

    //get user token_fcm from firestore using var user
    const invitedUserSnap = await admin
      .firestore()
      .collection("users")
      .doc(invited_user)
      .get();

    if (!invitedUserSnap.exists) {
      console.error(`User document not found for user: ${invitedUserSnap}`);
      return;
    }
    const userData = invitedUserSnap.data();
    if (!userData || !userData.fcm_token) {
      console.error(`No FCM token found for user: ${invited_user}`);
      return;
    }

    //get requested_user token_fcm from firestore using var requested_user
    const RequestedUserSnap = await admin
      .firestore()
      .collection("users")
      .doc(requested_user)
      .get();

    const requestedUserData = RequestedUserSnap.data();
    if (!requestedUserData) {
      console.error(`No requested user found: ${requested_user}`);
      return;
    }

    const title = `Friend Invitation`;
    const body = `${
      requestedUserData.name || requested_user
    } has invited you to be friends.`;

    const message: admin.messaging.Message = {
      token: userData.fcm_token,
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body: body,
            },
            sound: "default",
          },
        },
      },
      notification: {
        title,
        body: body,
      },
      data: {
        page: "pending-friends",
      },
      webpush: {
        notification: {},
      },
    };

    try {
      const response = await admin.messaging().send(message);
      // await admin
      //   .firestore()
      //   .collection("mail")
      //   .add({
      //     to: [userData.email],
      //     message: {
      //       subject: "Welcome to TryGlacier – Email confirmation",
      //       html:
      //         "<h1>Hi there,</h1>" +
      //         "<p>Welcome to Glacier! We're excited to have you on board.</p>" +
      //         "<p>This is just a quick confirmation to make sure your email setup is working properly. If you received this message, everything is up and running!</p>" +
      //         "<p>Best regards,<br>" +
      //         "The Glacier Team</p>",
      //     },
      //   });
      console.log("Push notification sent:", response);
    } catch (error) {
      console.error("Error sending FCM message:", error);
    }
  }
);

const bucket = admin.storage().bucket();
const execFileAsync = promisify(execFile);

export const runCompleteRecord = onCall(
  {
    memory: "1GiB",
    timeoutSeconds: 120,
  },
  async (request: {
    data: {
      videoPath: string;
      reactionPath: string;
      uuid: string;
      delayTime: number;
    };
  }) => {
    const { videoPath, reactionPath, uuid, delayTime } = request.data;

    if (!videoPath || !reactionPath) {
      throw new HttpsError("invalid-argument", "Missing video URLs.");
    }

    const tempDir = os.tmpdir();
    const sourcePath = path.join(tempDir, "source.mp4");
    const sourceReactionPath = path.join(tempDir, "reaction.mp4");
    const outputPath = path.join(tempDir, `${uuid}.mp4`);

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

    // Function to get video dimensions using ffprobe
    const getVideoDimensions = async (videoPath: string) => {
      const ffprobePath = path.join(__dirname, "ffmpeg", "ffprobe");
      const ffprobeArgs = [
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_streams",
        "-select_streams",
        "v:0",
        videoPath,
      ];

      const result = await execFileAsync(ffprobePath, ffprobeArgs);
      const videoInfo = JSON.parse(result.stdout);
      const videoStream = videoInfo.streams[0];

      return {
        width: parseInt(videoStream.width),
        height: parseInt(videoStream.height),
        isLandscape: parseInt(videoStream.width) > parseInt(videoStream.height),
      };
    };

    try {
      await downloadFile(videoPath, sourcePath);
      await downloadFile(reactionPath, sourceReactionPath);

      const ffmpegPath = path.join(__dirname, "ffmpeg", "ffmpeg");

      // Determine if source video is in landscape or portrait mode
      const { isLandscape } = await getVideoDimensions(sourcePath);

      const waterMark =
        "Glacier - true reaction | " +
        new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      const ffmpegArgs = isLandscape
        ? [
            "-i",
            sourcePath,
            "-i",
            sourceReactionPath,
            "-filter_complex",
            `[0:v]tpad=start_mode=clone:start_duration=${delayTime},scale=1080:720[vid1_scaled];` +
              `[1:v]setpts=PTS-STARTPTS,scale=1080:1200[vid2_scaled];` +
              `[vid1_scaled][vid2_scaled]vstack=inputs=2[stacked];` +
              `[stacked]drawbox=y=680:h=80:color=white@0.8:t=fill,` +
              `drawtext=text=${waterMark}:fontcolor=blue:fontsize=36:x=(w-text_w)/2:y=700[outv];` +
              `[0:a]adelay=${delayTime * 1000}|${delayTime * 1000}[a0];` +
              `[1:a]anull[a1];` +
              `[a0][a1]amix=inputs=2:duration=longest:dropout_transition=3[audio]`,
            "-map",
            "[outv]",
            "-map",
            "[audio]",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-preset",
            "fast",
            "-crf",
            "23",
            outputPath,
          ]
        : [
            "-i",
            sourcePath,
            "-i",
            sourceReactionPath,
            "-filter_complex",
            `[0:v]tpad=start_mode=clone:start_duration=${delayTime},scale=w=1080:h=-1,crop=1080:960:(in_w-1080)/2:(in_h-960)/2[vid1_scaled];` +
              `[1:v]setpts=PTS-STARTPTS,scale=w=1080:h=-1,crop=1080:960:(in_w-1080)/2:(in_h-960)/2[vid2_scaled];` +
              `[vid1_scaled][vid2_scaled]vstack=inputs=2[stacked];` +
              `[stacked]drawbox=y=ih/2-40:h=80:color=white@0.8:t=fill,` +
              `drawtext=text=${waterMark}:fontcolor=blue:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2[outv];` +
              `[0:a]adelay=${delayTime * 1000}|${delayTime * 1000}[a0];` +
              `[1:a]anull[a1];` +
              `[a0][a1]amix=inputs=2:duration=longest:dropout_transition=3[audio]`,
            "-map",
            "[outv]",
            "-map",
            "[audio]",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-preset",
            "fast",
            "-crf",
            "23",
            outputPath,
          ];

      await execFileAsync(ffmpegPath, ffmpegArgs);

      const destPath = `records/${uuid}.mp4`;
      const [file] = await bucket.upload(outputPath, {
        destination: destPath,
        metadata: { contentType: "video/mp4" },
      });

      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 12,
      });

      // Clean up temp files
      fs.unlinkSync(sourcePath);
      fs.unlinkSync(sourceReactionPath);
      fs.unlinkSync(outputPath);

      return { recordPath: `records/${uuid}.mp4`, recordUrl: signedUrl };
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
