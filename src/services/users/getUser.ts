import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../firebase";
import getOrganization from "../organizations/getOrganization";

 async function getUser(ref: string) {
  const c = collection(db, "users");
  const querySnapshot = await getDocs(query(c, where("uuid", "==", ref)));
  const data = querySnapshot.docs[0]?.data();

  if (!data) return null;

  return {
    uuid: data.uuid,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    fcm_token: data.fcm_token,
    created_at: data.created_at.toDate().toISOString(),
    organization: await getOrganization (data.uuid),
  };
}

export default getUser;
