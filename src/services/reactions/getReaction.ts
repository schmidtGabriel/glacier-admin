import { collection, getDocs, query, where } from "@firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import type { ReactionResource } from "../../resources/ReactionResource";
import getUser from "../users/getUser";

async function getReaction(ref: string): Promise<ReactionResource | null> {
  const c = collection(db, "reactions");
  const querySnapshot = await getDocs(query(c, where("uuid", "==", ref)));
  const data = querySnapshot.docs[0]?.data();

  if (!data) return null;

  const user = await getUser(data.user);

  return {
    ...data,
    uuid: data.uuid,
    title: data.title,
    description: data.description,
    user: user,
    created_at: data.created_at?.toDate().toISOString(),
    due_date: data.due_date?.toDate().toISOString(),
    video_recorded: data.recorded_video,
    type_video: data.type_video,
    status: data.status,
    video_url: await getVideoUrl(data.video_path),
    video_path: data.video_path,
    recorded_url: await getRecordedVideoUrl(data.recorded_path),
    recorded_path: data.recorded_path,
    reaction_url: await getReactionUrl(data.reaction_path),
    reaction_path: data.reaction_path,
    video_duration: data.video_duration,
  };
}

async function getRecordedVideoUrl(path: string): Promise<string> {
  if (!path) return "";
  const fileRef = ref(storage, path);
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting video URL:", error);
    return "";
  }
}

async function getReactionUrl(path: string): Promise<string> {
  if (!path) return "";
  const fileRef = ref(storage, path);
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting video URL:", error);
    return "";
  }
}

async function getVideoUrl(path: string) {
  if (path.includes("videos/")) {
    const fileRef = ref(storage, path);

    const url = await getDownloadURL(fileRef);

    return url;
  } else {
    return path;
  }
}

export default getReaction;
