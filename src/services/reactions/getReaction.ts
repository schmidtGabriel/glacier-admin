import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../firebase";

async function getReaction(ref: string) {
  const c = collection(db, "reactions");
  const querySnapshot = await getDocs(query(c, where("uuid", "==", ref)));
  return querySnapshot.docs[0]?.data();
}

export default getReaction;
