export const PermissionTypes = {
  DirectMessage: 'im,mpim',
  PrivateChannel: 'private_channel',
  PublicChannel: 'public_channel',
} as const;

// eslint-disable-next-line no-redeclare
export type PermissionTypes =
  typeof PermissionTypes[keyof typeof PermissionTypes];
