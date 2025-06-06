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
  url: string;
  selfie_video: boolean;
  selfie_url: string;
  recorded_url: string;
  video_url: string;
  created_at: string;
};
