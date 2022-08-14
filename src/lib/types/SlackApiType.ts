export const SlackApiType = {
  Channels: 'conversations.list',
  Members: 'users.list',
  Messages: 'conversations.history',
  Replies: 'conversations.replies',
} as const;

// eslint-disable-next-line no-redeclare
export type SlackApiType = typeof SlackApiType[keyof typeof SlackApiType];
