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
    'recored_url': await getRecordedVideoUrl(data.recorded_video),
    'video_url': await getVideoUrl(data.url),
  }
}

async function getRecordedVideoUrl(videoUrl: string): Promise<string> {
  if (!videoUrl) return "";
  const fileRef = ref(storage, videoUrl);
  const url = await getDownloadURL(fileRef);
  return url;
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
