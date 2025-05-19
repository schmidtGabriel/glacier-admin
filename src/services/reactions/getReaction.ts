import { collection, getDocs, query, where } from "@firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import getUser from "../users/getUser";

async function getReaction(ref: string) {
  const c = collection(db, "reactions");
  const querySnapshot = await getDocs(query(c, where("uuid", "==", ref)));
  const data = querySnapshot.docs[0]?.data();

  if (!data) return null;


  const user = await getUser(data.user);

  return {
    ...data,
    'uuid': data.uuid,
    'title': data.title,
    'user': user,
    'created_at': data.created_at?.toDate().toISOString(),
    'due_date': data.due_date?.toDate().toISOString(),
    'url': data.url,
    'video_recorded': data.recorded_video,
    'type_video': data.type_video,
    'status': data.status,
    'recored_url': await getRecordedVideoUrl(data.recorded_video),
    'video_url': await getVideoUrl(data.url),
    'video_duration': data.video_duration,
  }
}

async function getRecordedVideoUrl(videoUrl: string): Promise<string> {
  if (!videoUrl) return "";
  const fileRef = ref(storage, videoUrl);
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting video URL:", error);
    return "";
  }
}

async function getVideoUrl(videoUrl: string) {
  if(videoUrl.includes("videos/")){

    const fileRef = ref(storage, videoUrl);

    const url = await getDownloadURL(fileRef);

    return url;
  }else{
    return videoUrl;
  }
  
}


export default getReaction;
