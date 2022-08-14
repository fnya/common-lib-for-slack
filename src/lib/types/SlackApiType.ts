// こちらを import して使う
export const SlackApiType = {
  Channels: 'conversations.list',
  Members: 'users.list',
  Messages: 'conversations.history',
  Replies: 'conversations.replies',
} as const;

// こちらは定義するだけで使わない
export type SLACK_API_TYPE = typeof SlackApiType[keyof typeof SlackApiType];
