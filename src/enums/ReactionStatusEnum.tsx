export enum ReactionStatusEnum {
  Pending = 0,
  Sent = 1,
  Approved = 10,
  Rejected = -10,
}
export const ReactionStatusLabel = {
  [ReactionStatusEnum.Pending]: "Pending",
  [ReactionStatusEnum.Sent]: "Sent",
  [ReactionStatusEnum.Approved]: "Approved",
  [ReactionStatusEnum.Rejected]: "Rejected",
};
