import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../firebase";

type User = {
  uuid: string;
  email: string | null;
  name: string | null;
  role: number;
  disabled: boolean;
};

export async function listUsers(user_id?: string): Promise<User[]> {
  const q = collection(db, "users");

  const querySnapshot = await getDocs(
    !user_id ? query(q) : query(q, where("user_id", "==", user_id))
  );

  return querySnapshot.docs.map((doc) => ({
    uuid: doc.id,
    created_at: doc.data().created_at.toDate().toISOString(),
    email: doc.data().email,
    name: doc.data().name,
    role: doc.data().role,
  })) as any[];
}
