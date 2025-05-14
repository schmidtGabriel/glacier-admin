import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import getUser from "../user/getUser";

export const login = async (email: string, password: string) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = await getUser(userCredential.user.uid);
    if (!user || user["role"] !== "Admin") {
      auth.signOut();
      throw new Error("User unauthorized");
    }

    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
