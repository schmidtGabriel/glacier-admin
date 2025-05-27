import { addDoc, collection, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";

export default async function addUserOrganization(data: {
	user: string, organization: string} ){


		const payload = {
			...data,
		}

		 const ref = collection(db, "user_organizations");
		
		const docRef = await addDoc(ref, payload);

		return updateDoc(docRef, {
			uuid: docRef.id,
		})
			  
	}