import {
  addDoc,
  collection,
  DocumentReference,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { sendNotification } from "../notification/sendNotification";
import getUser from "../users/getUser";

export async function saveReaction({
  logUser,
  data,
}: {
  logUser: any;
  data: {
    user: string;
    title: string;
    url: string;
    type_video: string;
    due_date: string;
    status: string;
    video_duration: number;
    organization?: string;
  };
}): Promise<void | DocumentReference> {
  const org = logUser?.organization;

  const {
    user,
    url,
    title,
    type_video,
    video_duration,
    due_date,
    status,
    organization,
  } = data;

  const userOrg = organization || org?.uuid;

  const reaction = {
    user,
    title,
    video: url,
    type_video,
    due_date: due_date ? new Date(due_date) : null,
    status,
    created_at: new Date(),
    recorded_video: "",
    video_duration,
    organization: userOrg ? userOrg : null,
    requested: logUser?.uuid,
  };

  const reactionRef = collection(db, "reactions");

  const docRef = await addDoc(reactionRef, reaction);

  const userProp = await getUser(user);

  sendNotification(
    userProp?.fcm_token ?? "",
    `Hey ${userProp?.name}, we need your reaction!`,
    `Reaction: ${reaction.title}`,
    docRef.id
  );

  return updateDoc(docRef, {
    uuid: docRef.id,
  });
}
