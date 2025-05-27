import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../firebase";

async function getOrganization(ref: string) {
  if (!ref) return null;

  const c = collection(db, "organizations");
  const querySnapshot = await getDocs(query(c, where("admin", "==", ref)));
  const data = querySnapshot.docs[0]?.data();

  if (!data) return null;

  return {
    'uuid': data.uuid,
    'name': data.name,
  }
}



export default getOrganization;
