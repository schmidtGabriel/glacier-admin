export enum VideoTypeEnum {
	 ExternalLink = 1,
	 SocialLink = 2,
	 SourceVideo = 3
}

export const VideoTypeLabel = {
	[VideoTypeEnum.ExternalLink]: "External Link",
	[VideoTypeEnum.SocialLink]: "Social Link",
	[VideoTypeEnum.SourceVideo]: "Source Video"
};