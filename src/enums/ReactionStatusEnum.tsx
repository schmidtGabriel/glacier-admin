export enum ReactionStatusEnum {
  Hold = -1,
  Pending = 0,
  Sent = 1,
  Approved = 10,
  Rejected = -10,
}
export const ReactionStatusLabel = {
  [ReactionStatusEnum.Hold]: "Hold",
  [ReactionStatusEnum.Pending]: "Pending",
  [ReactionStatusEnum.Sent]: "Sent",
  [ReactionStatusEnum.Approved]: "Approved",
  [ReactionStatusEnum.Rejected]: "Rejected",
};
