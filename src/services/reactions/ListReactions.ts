import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
import { db } from "../../firebase";
import type { ReactionResource } from "../../resources/ReactionResource";
import getUser from "../users/getUser";

export async function listReactions(user: any): Promise<ReactionResource[]> {
  const q = collection(db, "reactions");
  const org = user?.organization;

  let _query = query(q, orderBy("created_at", "desc"));

  if (org && user?.role === UserRoleEnum.OrgAdmin) {
    const qUserOrg = collection(db, "user_organizations");
    const _queryOrgs = query(
      qUserOrg,
      where("organization", "==", org.uuid),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(_queryOrgs);
    const userIds = querySnapshot.docs.map((doc) => doc.data().user);
    _query = query(q, where("user", "in", userIds));
  }
  const querySnapshot = await getDocs(_query);

  const reactions = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      let userReaction = null;
      if (data?.user) {
        userReaction = await getUser(data?.user);
      }

      return {
        ...data,
        uuid: doc.id,
        created_at: data.created_at.toDate().toISOString(),
        due_date: data.due_date?.toDate().toISOString() ?? null,
        title: data.title,
        description: data.description,
        type_video: data.type_video,
        video_duration: data.video_duration,
        status: data.status,
        url: data.url,
        user: userReaction,
      } as unknown as ReactionResource;
    })
  );

  return reactions;
}
