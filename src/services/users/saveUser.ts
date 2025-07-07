import { addDoc, collection, updateDoc } from "@firebase/firestore";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
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
    role: logUser.role === UserRoleEnum.OrgAdmin ? UserRoleEnum.User : role,
    hasAccount: false,
  };

  const ref = collection(db, "users");
  const docRef = await addDoc(ref, user);

  await addUserOrganization({ organization: userOrg, user: docRef.id });

  return await updateDoc(docRef, {
    uuid: docRef.id,
  });
}
