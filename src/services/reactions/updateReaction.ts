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
  },
): Promise<void | DocumentReference> {
  const { user, url, title, type_video, due_date, status } = data;

  const payload = {
    user,
    url,
    title,
    type_video,
    due_date: new Date(due_date),
    status,
  };

  const reactionRef = doc(db, "reactions", data.uuid);

  return updateDoc(reactionRef, payload);
}
