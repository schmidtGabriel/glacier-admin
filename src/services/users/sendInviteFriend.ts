import { addDoc, collection, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";
import type { UserResource } from "../../resources/UserResource";

export async function sendInviteFriend({
  userId,
  user,
}: {
  userId: string;
  user: UserResource;
}): Promise<void> {
  const payload = {
    created_at: new Date(),
    invited_to: user.email,
    invited_user: user.uuid,
    requested_user: userId,
    status: 0,
  };

  const ref = collection(db, "friend_invitations");
  const docRef = await addDoc(ref, payload);

  return await updateDoc(docRef, {
    uuid: docRef.id,
  });
}
