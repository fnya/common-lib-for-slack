export const FolderType = {
  Messages: 'messages',
  Files: 'files',
  Logs: 'logs',
} as const;

// eslint-disable-next-line no-redeclare
export type FolderType = typeof FolderType[keyof typeof FolderType];
