import {
  addDoc,
  collection,
  DocumentReference,
  setDoc,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { sendNotification } from "../notification/sendNotification";
import getUser from "../users/getUser";

export async function saveReaction(data: {
  user: string;
  title: string;
  url: string;
  type_video: string;
  due_date: string;
  status: string;
}): Promise<void | DocumentReference> {
  const { user, url, title, type_video, due_date, status } = data;
  const reaction = {
    user,
    title,
    url,
    type_video,
    due_date: new Date(due_date),
    status,
    created_at: new Date(),
  };

  const reactionRef = collection(db, "reactions");

  const docRef = await addDoc(reactionRef, reaction);

  const userProp = await getUser(user);


   sendNotification(
       userProp.fcm_token,
      `Hey ${userProp.name} reagiu à sua postagem!`,
      `Reaction: ${reaction.title}`,
      docRef.id
    );

  return setDoc(docRef, {
    uuid: docRef.id,
    ...reaction,
  });
}
