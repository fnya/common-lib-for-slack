export const FolderType = {
  Messages: 'messages',
  Files: 'files',
  Json: 'json',
  Logs: 'logs',
  Slack: 'slack',
  Members: 'members',
  Admin: 'admin',
  System: 'system',
} as const;

// eslint-disable-next-line no-redeclare
export type FolderType = typeof FolderType[keyof typeof FolderType];
