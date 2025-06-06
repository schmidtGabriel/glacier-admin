export type UserResource = {
  uuid: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: number;
  fcm_token?: string | null;
  organization?: {
    uuid: string;
    name: string;
  } | null;
  created_at: string;
  avatar?: string | null;
};
