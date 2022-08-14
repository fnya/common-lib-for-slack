import { PropertyType } from '../../../src/lib/types/PropertyType';

describe('PropertyType のテスト', () => {
  test('PropertyType が正しい', () => {
    const expected = {
      SlackApiToken: 'SlackApiToken',
      MembersFolerId: 'MembersFolerId',
      AdminFolerId: 'AdminFolerId',
      SystemFolerId: 'SystemFolerId',
      Version: 'Version',
      CryptoKey: 'CryptoKey',
      StretchingCount: 'StretchingCount',
      Pepper: 'Pepper',
    };
    expect(expected).toEqual(PropertyType);
  });
});
