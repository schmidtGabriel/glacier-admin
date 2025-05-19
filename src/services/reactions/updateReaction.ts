import { doc, DocumentReference, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";

export function updateReaction(
  data: {
    uuid: string;
    user: string;
    title: string;
    type_video: string;
    url: string;
    due_date: string;
    status: string;
    video_duration: number;
  },
): Promise<void | DocumentReference> {
  const { user, url, title, type_video, due_date,video_duration, status } = data;

  const payload = {
    user,
    url,
    title,
    type_video,
    due_date: new Date(due_date),
    status,
    video_duration
  };

  const reactionRef = doc(db, "reactions", data.uuid);

  return updateDoc(reactionRef, payload);
}
