import { addDoc, collection, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";

export default async function createOrganization(data: {
	name: string, admin: string} ){

		const org = {
			...data,
			created_at: new Date(),
		}

		 const orgRef = collection(db, "organizations");
		const docRef = await addDoc(orgRef, org);

		const res = updateDoc(docRef, {
			uuid: docRef.id,
		})

		return res.then(() => {
			return {
				name: org.name,
				uuid: docRef.id,
			};
		});
			  
	}