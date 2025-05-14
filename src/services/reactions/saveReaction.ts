import {
  addDoc,
  collection,
  DocumentReference,
  setDoc,
} from "@firebase/firestore";
import { db } from "../../firebase";

export async function saveReaction(data: {
  user: string;
  url: string;
  due_date: string;
  status: string;
}): Promise<void | DocumentReference> {
  const { user, url, due_date, status } = data;
  const reaction = {
    user,
    url,
    due_date: new Date(due_date),
    status,
    created_at: new Date(),
  };

  const reactionRef = collection(db, "reactions");

  const docRef = await addDoc(reactionRef, reaction);

  return setDoc(docRef, {
    uuid: docRef.id,
    ...reaction,
  });
}
