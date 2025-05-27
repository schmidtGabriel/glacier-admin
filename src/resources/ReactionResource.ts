import type { UserResource } from "./UserResource";

export type ReactionResource = {
	uuid: string;
	title: string;
	description: string;
	user: UserResource;
	status: number;
	type_video: number;
	due_date: string;
	video_duration: number;
	video_recorded: boolean;
	url: string;
	selfie_video: boolean;
	selfie_url: string;
	recorded_url: string;
	video_url: string;
	created_at: string;
};

