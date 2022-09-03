export const FolderType = {
  Messages: 'messages',
  Files: 'files',
  Logs: 'logs',
  Json: 'json',
} as const;

// eslint-disable-next-line no-redeclare
export type FolderType = typeof FolderType[keyof typeof FolderType];
