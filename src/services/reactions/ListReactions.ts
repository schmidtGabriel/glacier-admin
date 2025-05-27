import { collection, getDocs, query, where } from "@firebase/firestore";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
import { db } from "../../firebase";
import type { ReactionResource } from "../../resources/ReactionResource";
import getUser from "../users/getUser";

export async function listReactions(user: any): Promise<ReactionResource[]> {
  const q = collection(db, "reactions");
  const org = user?.organization;

  let _query = query(q);

  if (org && user?.role === UserRoleEnum.OrgAdmin) {
    _query = query(q, where("organization", "==", org.uuid));
  }
  const querySnapshot = await getDocs(_query);

  const reactions = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();

      const user = await getUser(data.user);

      return {
        ...data,
        uuid: doc.id,
        created_at: data.created_at.toDate().toISOString(),
        due_date: data.due_date.toDate().toISOString(),
        title: data.title,
        description: data.description,
        type_video: data.type_video,
        video_duration: data.video_duration,
        status: data.status,
        url: data.url,
        user,
      } as unknown as ReactionResource;
    })
  );

  return reactions;
}
