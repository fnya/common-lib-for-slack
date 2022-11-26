const PropertyType = {
  AdminFolerId: 'AdminFolerId',
  AuthVersion: 'AuthVersion',
  Initialized: 'Initialized',
  JwtIssuer: 'JwtIssuer',
  JwtSecret: 'JwtSecret',
  LogsFolerId: 'LogsFolerId',
  MembersFolerId: 'MembersFolerId',
  Pepper: 'Pepper',
  RefreshTokenEffectiveDays: 'RefreshTokenEffectiveDays',
  SlackApiToken: 'SlackApiToken',
  SlackFolerId: 'SlackFolerId',
  StretchingCount: 'StretchingCount',
  SystemFolerId: 'SystemFolerId',
} as const;

// eslint-disable-next-line no-redeclare
type PropertyType = typeof PropertyType[keyof typeof PropertyType];

export default PropertyType;
