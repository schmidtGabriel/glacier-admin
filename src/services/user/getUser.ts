import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../firebase";

export async function getUser(ref: string) {
  const c = collection(db, "users");
  const querySnapshot = await getDocs(query(c, where("uuid", "==", ref)));

  return querySnapshot.docs[0]?.data();
}
