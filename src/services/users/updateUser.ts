import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";

export async function updateUser(
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    uuid: string;
    role: number;
  },
): Promise<void> {
  const { name, email, phone, role } = data;

  const payload: {
    name: string;
    email: string;
    phone: string;
    role: number;
  } = {
    name,
    email,
    phone,
    role
  };

  const reactionRef = doc(db, "users", data.uuid);

  return updateDoc(reactionRef, payload);
}
