export const SpreadSheetType = {
  Channels: 'channels',
  Members: 'members',
  Messages: 'messages',
  Replies: 'replies',
  UserAccount: 'userAccounts',
  BasicAccount: 'basicAccount',
  MessageStatus: 'messageStatus',
  repliesStatus: 'repliesStatus',
} as const;

// eslint-disable-next-line no-redeclare
export type SpreadSheetType =
  typeof SpreadSheetType[keyof typeof SpreadSheetType];
