export const FolderType = {
  Admin: 'admin',
  Files: 'files',
  Json: 'json',
  Logs: 'logs',
  Members: 'members',
  Messages: 'messages',
  Slack: 'slack',
  System: 'system',
} as const;

// eslint-disable-next-line no-redeclare
export type FolderType = typeof FolderType[keyof typeof FolderType];
