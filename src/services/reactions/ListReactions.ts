import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../../firebase";
import type { Reaction } from "../../types/Reaction";
import getUser from "../users/getUser";

export async function listReactions(): Promise<Reaction[]> {
  const q = collection(db, "reactions");
  const querySnapshot = await getDocs(query(q));

  const reactions = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const user = await getUser(data.user);

      return {
        ...data,
        uuid: doc.id,
        created_at: data.created_at.toDate().toISOString(),
        due_date: data.due_date.toDate().toISOString(),
        status: data.status,
        url: data.url,
        user,
      };
    })
  );

  return reactions;
}
