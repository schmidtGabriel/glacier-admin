import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const sendPushNotification = functions.https.onRequest(
  async (req, res): Promise<any> => {
    if (req.method !== "POST") {
      return res.status(405).send("Only POST requests allowed");
    }

    const { token, title, body, reaction } = req.body;

    if (!token || !title || !body || !reaction) {
      return res.status(400).send("Missing token, title or body");
    }

    const message: admin.messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      data: {
        // Add any additional data you want to send with the notification
        reaction: reaction, // Replace with actual reaction ID if needed
      },
      webpush: {
        notification: {
          // icon: "https://yourdomain.com/icon.png", // Optional
        },
      },
    };

    try {
      const response = await admin.messaging().send(message);
      return res.status(200).send({ success: true, response });
    } catch (error) {
      console.error("Error sending FCM message:", error);
      return res.status(500).send({ success: false, error });
    }
  }
);

