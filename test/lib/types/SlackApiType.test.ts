import { SlackApiType } from '../../../src/lib/types/SlackApiType';
import { describe, test, expect } from '@jest/globals';

describe('SlackApiType のテスト', () => {
  test('SlackApiType が正しい', () => {
    const expected = {
      Channels: 'conversations.list',
      Members: 'users.list',
      Messages: 'conversations.history',
      Replies: 'conversations.replies',
    };
    expect(expected).toEqual(SlackApiType);
  });
});
