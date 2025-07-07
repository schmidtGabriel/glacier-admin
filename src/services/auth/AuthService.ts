import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
import { db } from "../../firebase";
import addUserOrganization from "../organizations/addUserOrganization";
import createOrganization from "../organizations/createOrganization";
import getUser from "../users/getUser";

export const login = async (email: string, password: string) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = await getUser(userCredential.user.uid);
    if (
      !user ||
      (user["role"] !== UserRoleEnum.Admin &&
        user["role"] !== UserRoleEnum.OrgAdmin)
    ) {
      auth.signOut();
      throw new Error("User unauthorized");
    }

    if (userCredential.user) {
      const userData = await getUser(userCredential.user.uid);
      if (!userData) {
        throw new Error("User not found");
      }

      return userData;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signup = async (data: {
  email: string;
  name: string;
  phone: string;
  password: string;
  members: string[];
  organization: string;
}) => {
  try {
    const user = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      created_at: new Date(),
      role: 20,
      hasAccount: true,
    };
    return createUserWithEmailAndPassword(getAuth(), data.email, data.password)
      .then(async (userCredential) => {
        // Signed in
        const fbUser = userCredential.user;
        const userRef = collection(db, "users");

        const querySnapshot = await getDocs(
          query(userRef, where("email", "==", data.email))
        );
        const createdUser = querySnapshot.docs[0]?.data();
        if (!createdUser) {
          //save user
          await setDoc(doc(userRef, fbUser.uid), {
            ...user,
            uuid: fbUser.uid,
          });

          if (fbUser) {
            // get user data
            const userData = await getUser(fbUser.uid);
            if (!userData) {
              throw new Error("User not found");
            }

            // If the user is an OrgAdmin, create an organization and add members
            if (userData.role === UserRoleEnum.OrgAdmin) {
              const org = await createOrganization({
                name: data.organization,
                admin: fbUser.uid,
              });

              if (!org) {
                throw new Error("Failed to create organization");
              }

              for (const member of data.members) {
                await addUserOrganization({
                  user: member,
                  organization: org.uuid,
                });
              }

              userData.organization = org;
            }

            return userData;
          }
        } else {
          return createdUser;
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
