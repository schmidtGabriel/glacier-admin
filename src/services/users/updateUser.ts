import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";

export async function updateUser(
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    uuid: string;
  },
): Promise<void> {
  const { name, email, phone } = data;

  const payload: {
    name: string;
    email: string;
    phone: string;
  } = {
    name,
    email,
    phone,
  };

  const reactionRef = doc(db, "users", data.uuid);

  return updateDoc(reactionRef, payload);
}
