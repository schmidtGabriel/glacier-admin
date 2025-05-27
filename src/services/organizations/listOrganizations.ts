import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../../firebase";
import getUser from "../users/getUser";

export async function listOrganizations(): Promise<any[]> {
  const q = collection(db, "organizations");

  const _query = query(q);
  const querySnapshot = await getDocs(_query);

  const organizations = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();

      const user = await getUser(data.admin);

      return {
        ...data,
        uuid: doc.id,
        name: data.name,
        admin: user,
      };
    })
  );

  return organizations;
}
