import type { ReactionStatusEnum } from "../enums/ReactionStatusEnum";
import type { VideoTypeEnum } from "../enums/VideoTypeEnum";
import type { UserResource } from "./UserResource";

export type ReactionResource = {
  uuid: string;
  title: string;
  description: string;
  user: UserResource | null;
  status: ReactionStatusEnum;
  type_video: VideoTypeEnum;
  due_date: string;
  video_duration: number;
  video_recorded: boolean;
  video_path: string;
  video_url: string;
  reaction_path: string;
  reaction_url: string;
  recorded_path: string;
  recorded_url: string;
  created_at: string;
};
