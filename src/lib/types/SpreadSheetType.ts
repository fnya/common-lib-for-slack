export const SpreadSheetType = {
  Channels: 'channels',
  Members: 'members',
  Messages: 'messages',
  MessageStatus: 'messageStatus',
  Replies: 'replies',
  RepliesStatus: 'repliesStatus',
  UserAccount: 'userAccounts',
} as const;

// eslint-disable-next-line no-redeclare
export type SpreadSheetType =
  typeof SpreadSheetType[keyof typeof SpreadSheetType];
