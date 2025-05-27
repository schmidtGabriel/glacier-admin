export type UserResource = {
	  uuid: string;
	  email: string | null;
	  name: string | null;
	  role: number;
	  organization?: {
		    uuid: string;
		    name: string;
	  } | null;
	  created_at: string;
	  avatar?: string | null;
};