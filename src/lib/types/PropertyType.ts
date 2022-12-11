const PropertyType = {
  AccessTokenEffectiveMinutes: 'AccessTokenEffectiveMinutes',
  AdminFolerId: 'AdminFolerId',
  AuthAlgorithmVersion: 'AuthAlgorithmVersion',
  AuthDataVersion: 'AuthDataVersion',
  Initialized: 'Initialized',
  JwtIssuer: 'JwtIssuer',
  JwtSecret: 'JwtSecret',
  LogsFolerId: 'LogsFolerId',
  MembersFolerId: 'MembersFolerId',
  Pepper: 'Pepper',
  RefreshTokenEffectiveDays: 'RefreshTokenEffectiveDays',
  SlackApiToken: 'SlackApiToken',
  SlackFolerId: 'SlackFolerId',
  SlackPermissions: 'SlackPermissions',
  StretchingCount: 'StretchingCount',
  SystemFolerId: 'SystemFolerId',
  UserTokenEffectiveMinutes: 'UserTokenEffectiveMinutes',
} as const;

// eslint-disable-next-line no-redeclare
type PropertyType = typeof PropertyType[keyof typeof PropertyType];

export default PropertyType;
