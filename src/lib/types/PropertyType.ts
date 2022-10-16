const PropertyType = {
  SlackApiToken: 'SlackApiToken',
  MembersFolerId: 'MembersFolerId',
  AdminFolerId: 'AdminFolerId',
  SystemFolerId: 'SystemFolerId',
  LogFolerId: 'LogFolerId',
  AuthVersion: 'AuthVersion',
  StretchingCount: 'StretchingCount',
  Pepper: 'Pepper',
  JwtSecret: 'JwtSecret',
} as const;

// eslint-disable-next-line no-redeclare
type PropertyType = typeof PropertyType[keyof typeof PropertyType];

export default PropertyType;
