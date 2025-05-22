import { collection, doc, setDoc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { db } from "../../firebase";

export function saveUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: number;
}): Promise<void> {
  const { name, email, password, phone, role } = data;

  const user = {
    name,
    email,
    created_at: new Date(),
    phone,
    role,
  };

  return createUserWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      // Signed in
      const fbUser = userCredential.user;
      const reactionRef = collection(db, "users");

      return setDoc(doc(reactionRef, fbUser.uid), {
        ...user,
        uuid: fbUser.uid,
      });
      // You can also save additional user data in Firestore if needed
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
