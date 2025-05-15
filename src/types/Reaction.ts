import firebase from "firebase/compat/app";

export type Reaction = {
  uuid: string;
  user: firebase.firestore.DocumentData | null | undefined;
  url: string;
  due_date: string;
  status: string;
  created_at: string;
};