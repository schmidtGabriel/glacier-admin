import { collection, getDocs, query, where } from "@firebase/firestore";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
import { db } from "../../firebase";
import type { UserResource } from "../../resources/UserResource";

export async function listUsers(user?: UserResource): Promise<UserResource[]> {
  const q = collection(db, "users");

  const org = user?.organization;
  let _query = query(q);

  if (user) {
    if (user?.role === UserRoleEnum.Admin) {
      const querySnapshot = await getDocs(_query);
      return querySnapshot.docs.map((doc) => ({
        uuid: doc.id,
        created_at: doc.data().created_at.toDate().toISOString(),
        email: doc.data().email,
        name: doc.data().name,
        role: doc.data().role,
      }));
    } else {
      if (!org) return [];

      const qUserOrg = collection(db, "user_organizations");
      const _queryOrgs = query(qUserOrg, where("organization", "==", org.uuid));
      const querySnapshot = await getDocs(_queryOrgs);
      const userIds = querySnapshot.docs.map((doc) => doc.data().user);
      _query = query(q, where("uuid", "in", userIds));
      const userQuerySnapshot = await getDocs(_query);
      return userQuerySnapshot.docs.map((doc) => ({
        uuid: doc.id,
        created_at: doc.data().created_at.toDate().toISOString(),
        email: doc.data().email,
        name: doc.data().name,
        role: doc.data().role,
      }));
    }
  } else {
    _query = query(q, where("role", "==", UserRoleEnum.User));
    const querySnapshot = await getDocs(_query);
    return querySnapshot.docs.map((doc) => ({
      uuid: doc.id,
      created_at: doc.data().created_at.toDate().toISOString(),
      email: doc.data().email,
      name: doc.data().name,
      role: doc.data().role,
    }));
  }
}
