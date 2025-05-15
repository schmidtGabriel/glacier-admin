import { pushUrl } from "../../firebase";

export const sendNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  reaction: string
): Promise<void> => {
  try {
    const response = await fetch(pushUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: fcmToken,
        title: title,
        body: body,
        reaction: reaction,
      }),
    });
    console.log("✅ Successfully sent message:", response);
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
};
