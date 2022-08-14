export const PropertyType = {
  SlackApiToken: 'SlackApiToken',
  MembersFolerId: 'MembersFolerId',
  AdminFolerId: 'AdminFolerId',
  SystemFolerId: 'SystemFolerId',
  Version: 'Version',
  CryptoKey: 'CryptoKey',
  StretchingCount: 'StretchingCount',
  Pepper: 'Pepper',
} as const;

// eslint-disable-next-line no-redeclare
export type PropertyType = typeof PropertyType[keyof typeof PropertyType];
