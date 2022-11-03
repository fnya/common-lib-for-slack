const PropertyType = {
  AdminFolerId: 'AdminFolerId',
  AuthVersion: 'AuthVersion',
  JwtSecret: 'JwtSecret',
  LogFolerId: 'LogFolerId',
  MembersFolerId: 'MembersFolerId',
  Pepper: 'Pepper',
  SlackApiToken: 'SlackApiToken',
  SlackFolerId: 'SlackFolerId',
  StretchingCount: 'StretchingCount',
  SystemFolerId: 'SystemFolerId',
} as const;

// eslint-disable-next-line no-redeclare
type PropertyType = typeof PropertyType[keyof typeof PropertyType];

export default PropertyType;
