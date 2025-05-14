import { doc, DocumentReference, setDoc } from "@firebase/firestore";
import { db } from "../../firebase";

export function updateReaction(
  data: {
    user: string;
    url: string;
    due_date: string;
    status: string;
  },
  reaction: any
): Promise<void | DocumentReference> {
  const { user, url, due_date, status } = data;

  const payload = {
    user,
    url,
    due_date: new Date(due_date),
    status,
    created_at: new Date(),
    uuid: reaction.uuid,
  };

  const reactionRef = doc(db, "reactions", reaction.uuid);

  return setDoc(reactionRef, { ...reaction, ...payload });
}
