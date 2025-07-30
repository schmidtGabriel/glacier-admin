import { addDoc, collection, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";
import type { UserResource } from "../../resources/UserResource";
import addUserOrganization from "../organizations/addUserOrganization";

export async function saveUser({
  logUser,
  data,
}: {
  logUser: UserResource;
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
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
    role: parseInt(role) || 10, // Default to User role if not specified
    hasAccount: false,
  };

  const ref = collection(db, "users");
  const docRef = await addDoc(ref, user);

  await addUserOrganization({ organization: userOrg, user: docRef.id });

  return await updateDoc(docRef, {
    uuid: docRef.id,
  });
}
