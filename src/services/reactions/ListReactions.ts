import { collection, getDocs, query } from "@firebase/firestore";
import firebase from "firebase/compat/app";
import { db } from "../../firebase";
import getUser from "../user/getUser";

type Reaction = {
  uuid: string;
  user: firebase.firestore.DocumentData | null | undefined;
  url: string;
  due_date: string;
  status: string;
  created_at: string;
};
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
