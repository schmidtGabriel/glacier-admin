import { addDoc, collection, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";
import addUserOrganization from "../organizations/addUserOrganization";

export async function saveUser({
  logUser,
  data,
}: {
  logUser: any;
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: number;
    organization?: string;
  };
}): Promise<void> {
  const org = logUser?.organization;
  const { name, email, phone, role, organization } = data;

  const userOrg = organization || org?.uuid;

  if (!userOrg) return;

  const user = {
    name,
    email,
    created_at: new Date(),
    phone,
    role,
  };

  const ref = collection(db, "users");
  const docRef = await addDoc(ref, user);

  await addUserOrganization({ organization: userOrg, user: docRef.id });

  return updateDoc(docRef, {
    uuid: docRef.id,
  });
}
