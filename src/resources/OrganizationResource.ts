export type OrganizationResource = {
	  uuid: string;
	  name: string | null;
	  admin?: {
		    uuid: string;
		    name: string;
	  } | null;
	  created_at: string;
};