import { doc, setDoc } from "@firebase/firestore";
import { db } from "../../firebase";

export async function updateUser(
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  },
  existingUser: any
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

  const reactionRef = doc(db, "users", existingUser.uuid);

  return setDoc(reactionRef, { ...existingUser, ...payload });
}
