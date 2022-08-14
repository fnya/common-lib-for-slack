// こちらを import して使う
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

// こちらは定義するだけで使わない
export type PROPERTY_TYPE = typeof PropertyType[keyof typeof PropertyType];
