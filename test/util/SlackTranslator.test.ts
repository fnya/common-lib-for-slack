import 'reflect-metadata';
import { Container } from 'inversify';
import { describe, test, beforeEach, expect } from '@jest/globals';
import Types from '../../src/lib/types/Types';
import { DateUtil } from '../../src/lib/util/DateUtil';
import { SlackTranslator } from '../../src/lib/util/SlackTranslator';
import { Channel } from '../../src/lib/entity/Channel';
import { Member } from '../../src/lib/entity/Member';
import { MessageStatus } from '../../src/lib/entity/MessageStatus';
import { ReplyStatus } from '../../src/lib/entity/ReplyStatus';
import { when, instance, verify, mock } from 'ts-mockito';
import { Message } from '../../src/lib/entity/Message';
import { Reply } from '../../src/lib/entity/Reply';

describe('SlackTranslator のテスト', () => {
  let container: Container;
  let slackTranslator: SlackTranslator;
  let dateUtilMock: any;

  beforeEach(() => {
    // inversify の初期化
    container = new Container();

    dateUtilMock = mock(DateUtil);
    container.bind<SlackTranslator>(Types.SlackTranslator).to(SlackTranslator);
    container
      .bind<DateUtil>(Types.DateUtil)
      .toConstantValue(instance(dateUtilMock));

    slackTranslator = container.get<SlackTranslator>(Types.SlackTranslator);
  });

  afterEach(() => {
    // Dateのモックを元に戻す
    jest.useRealTimers();
  });

  describe('translateToChannels のテスト', () => {
    test('チャンネルの配列に変換できること', () => {
      // 準備
      const channels = [
        {
          id: 'channel2',
          name: 'name2',
          is_private: false,
          topic: { value: 'topic2' },
          purpose: { value: 'purpose2' },
        },
        {
          id: 'channel1',
          name: 'name1',
          is_private: true,
          topic: { value: 'topic1' },
          purpose: { value: 'purpose1' },
        },
      ];

      const expected = [
        new Channel('channel1', 'name1', true, 'topic1', 'purpose1'),
        new Channel('channel2', 'name2', false, 'topic2', 'purpose2'),
      ];

      // 実行
      const actual = slackTranslator.translateToChannels(channels);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateChannelsToArrays のテスト', () => {
    test('チャンネルの配列をarrayの配列に変換できること', () => {
      // 準備
      const channels = [
        new Channel('channel1', 'name1', true, 'topic1', 'purpose1'),
        new Channel('channel2', 'name2', false, 'topic2', 'purpose2'),
      ];
      const expected = [
        ['channel1', 'name1', 'true', 'topic1', 'purpose1'],
        ['channel2', 'name2', 'false', 'topic2', 'purpose2'],
      ];

      // 実行
      const actual = slackTranslator.translateChannelsToArrays(channels);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateArraysToChannels のテスト', () => {
    test('arrayの配列をチャンネルの配列に変換できること', () => {
      // 準備
      const channels = [
        ['channel1', 'name1', 'true', 'topic1', 'purpose1'],
        ['channel2', 'name2', 'false', 'topic2', 'purpose2'],
      ];
      const expected = [
        new Channel('channel1', 'name1', true, 'topic1', 'purpose1'),
        new Channel('channel2', 'name2', false, 'topic2', 'purpose2'),
      ];

      // 実行
      const actual = slackTranslator.translateArraysToChannels(channels);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateToMembers のテスト', () => {
    test('メンバーの配列に変換できること', () => {
      // 準備
      const entities = [
        {
          id: 'member3',
          name: 'name3',
          profile: {
            display_name: 'display_name3',
            image_original: 'https://example.com/image3',
          },
          deleted: false,
          is_bot: true,
        },
        {
          id: 'member2',
          name: 'name2',
          profile: {
            display_name: 'display_name2',
            image_original: 'https://example.com/image2',
          },
          deleted: false,
          is_bot: false,
        },
        {
          id: 'member1',
          name: 'name1',
          profile: {
            display_name: 'display_name1',
            image_original: 'https://example.com/image1',
          },
          deleted: false,
          is_bot: false,
        },
      ];
      const expected = [
        new Member(
          'member1',
          'name1',
          'display_name1',
          false,
          false,
          'https://example.com/image1'
        ),
        new Member(
          'member2',
          'name2',
          'display_name2',
          false,
          false,
          'https://example.com/image2'
        ),
        new Member(
          'member3',
          'name3',
          'display_name3',
          false,
          true,
          'https://example.com/image3'
        ),
      ];

      // 実行
      const actual = slackTranslator.translateToMembers(entities);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateMembersToArrays のテスト', () => {
    test('メンバーの配列をarrayの配列に変換できること', () => {
      // 準備
      const members = [
        new Member(
          'member1',
          'name1',
          'display_name1',
          false,
          false,
          'https://example.com/image1'
        ),
        new Member(
          'member2',
          'name2',
          'display_name2',
          false,
          false,
          'https://example.com/image2'
        ),
        new Member('member3', 'name3', 'display_name3', false, true, null),
      ];
      const expected = [
        [
          'member1',
          'name1',
          'display_name1',
          'false',
          'https://example.com/image1',
          'false',
        ],
        [
          'member2',
          'name2',
          'display_name2',
          'false',
          'https://example.com/image2',
          'false',
        ],
        ['member3', 'name3', 'display_name3', 'false', '', 'true'],
      ];

      // 実行
      const actual = slackTranslator.translateMembersToArrays(members);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateArraysToMembers のテスト', () => {
    test('arrayの配列をメンバーの配列に変換できること', () => {
      // 準備
      const arrays = [
        [
          'member1',
          'name1',
          'display_name1',
          'false',
          'https://example.com/image1',
          'false',
        ],
        [
          'member2',
          'name2',
          'display_name2',
          'false',
          'https://example.com/image2',
          'false',
        ],
        ['member3', 'name3', 'display_name3', 'false', '', 'true'],
      ];
      const expected = [
        new Member(
          'member1',
          'name1',
          'display_name1',
          false,
          false,
          'https://example.com/image1'
        ),
        new Member(
          'member2',
          'name2',
          'display_name2',
          false,
          false,
          'https://example.com/image2'
        ),
        new Member('member3', 'name3', 'display_name3', false, true, null),
      ];

      // 実行
      const actual = slackTranslator.translateArraysToMembers(arrays);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateArraysToMessageStatus のテスト', () => {
    test('arrayの配列をメッセージステータスの配列に変換できること', () => {
      // 準備
      const arrays = [
        ['channel1', '1668783600', '2022-11-19 00:00:00'],
        ['channel2', '1668913830', '2022-11-20 12:10:03'],
      ];
      const expected = [
        new MessageStatus('channel1', '1668783600', '2022-11-19 00:00:00'),
        new MessageStatus('channel2', '1668913830', '2022-11-20 12:10:03'),
      ];

      // 実行
      const actual = slackTranslator.translateArraysToMessageStatus(arrays);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateArraysToReplyStatus のテスト', () => {
    test('arrayの配列をリプライステータスの配列に変換できること', () => {
      // 準備
      const arrays = [
        ['channel1', '1668783600', '2022-11-19 00:00:00'],
        ['channel2', '1668913830', '2022-11-20 12:10:03'],
      ];
      const expected = [
        new ReplyStatus('channel1', '1668783600', '2022-11-19 00:00:00'),
        new ReplyStatus('channel2', '1668913830', '2022-11-20 12:10:03'),
      ];

      // 実行
      const actual = slackTranslator.translateArraysToMessageStatus(arrays);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateToMessages のテスト', () => {
    test('メッセージの配列に変換できること', () => {
      // 準備
      const entities = [
        {
          ts: '1668924650',
          user: 'user1',
          text: 'message1',
          reply_count: 1,
          latest_reply: '1668924660',
          edited: {
            ts: '1668924720',
          },
          reactions: [
            {
              name: 'reaction1',
              count: 1,
            },
            {
              name: 'reaction2',
              count: 2,
            },
          ],
          files: [
            {
              id: 'file1',
              name: 'fileName1',
              mimetype: 'image/png',
              filetype: 'png',
              url_private_download: 'https://example.com/file1',
              created: '1668924780',
            },
            {
              id: 'file2',
              name: 'fileName2',
              mimetype: 'image/jpeg',
              filetype: 'jpg',
              url_private_download: 'https://example.com/file2',
              created: '1668924840',
            },
          ],
          attachments: [
            {
              original_url: 'https://example.com/url1',
              title: 'title1',
              text: 'text1',
            },
            { title: 'title2', text: 'text2' },
            { original_url: 'https://example.com/url3', text: 'text3' },
            { original_url: 'https://example.com/url4', title: 'title4' },
          ],
        },
        { ts: '1668924651', user: 'user2', text: 'message2' },
      ];
      const members = [
        new Member(
          'user1',
          '',
          'userName1',
          false,
          false,
          'https://example.com/member1'
        ),
        new Member(
          'user2',
          'userName2',
          '',
          false,
          false,
          'https://example.com/member1'
        ),
      ];
      const json1 =
        '{"ts":"1668924650","user":"user1","text":"message1","reply_count":1,"latest_reply":"1668924660","edited":{"ts":"1668924720"},"reactions":[{"name":"reaction1","count":1},{"name":"reaction2","count":2}],"files":[{"id":"file1","name":"fileName1","mimetype":"image/png","filetype":"png","url_private_download":"https://example.com/file1","created":"1668924780"},{"id":"file2","name":"fileName2","mimetype":"image/jpeg","filetype":"jpg","url_private_download":"https://example.com/file2","created":"1668924840"}],"attachments":[{"original_url":"https://example.com/url1","title":"title1","text":"text1"},{"title":"title2","text":"text2"},{"original_url":"https://example.com/url3","text":"text3"},{"original_url":"https://example.com/url4","title":"title4"}]}';
      const json2 = '{"ts":"1668924651","user":"user2","text":"message2"}';
      const expected = [
        new Message(
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'message1',
          1,
          '1668924660',
          '2022-11-20 15:11:00',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          true,
          '1668924720',
          '2022-11-20 15:12:00',
          json1
        ),
        new Message(
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'message2',
          0,
          '',
          '',
          '[]',
          '[]',
          '[]',
          false,
          '',
          '',
          json2
        ),
      ];
      when(dateUtilMock.createDateTimeString('1668924650')).thenReturn(
        '2022-11-20 15:10:50'
      );
      when(dateUtilMock.createDateTimeString('1668924651')).thenReturn(
        '2022-11-20 15:10:51'
      );
      when(dateUtilMock.createDateTimeString('1668924660')).thenReturn(
        '2022-11-20 15:11:00'
      );
      when(dateUtilMock.createDateTimeString('1668924720')).thenReturn(
        '2022-11-20 15:12:00'
      );
      when(dateUtilMock.createDateTimeString('1668924780')).thenReturn(
        '2022-11-20 15:13:00'
      );
      when(dateUtilMock.createDateTimeString('1668924840')).thenReturn(
        '2022-11-20 15:14:00'
      );

      // 実行
      const actual = slackTranslator.translateToMessages(entities, members);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateMessagesToArrays のテスト', () => {
    test('メッセージの配列をarrayの配列に変換できること', () => {
      // 準備
      const json1 =
        '{"ts":"1668924650","user":"user1","text":"message1","reply_count":1,"latest_reply":"1668924660","edited":{"ts":"1668924720"},"reactions":[{"name":"reaction1","count":1},{"name":"reaction2","count":2}],"files":[{"id":"file1","name":"fileName1","mimetype":"image/png","filetype":"png","url_private_download":"https://example.com/file1","created":"1668924780"},{"id":"file2","name":"fileName2","mimetype":"image/jpeg","filetype":"jpg","url_private_download":"https://example.com/file2","created":"1668924840"}],"attachments":[{"original_url":"https://example.com/url1","title":"title1","text":"text1"},{"title":"title2","text":"text2"},{"original_url":"https://example.com/url3","text":"text3"},{"original_url":"https://example.com/url4","title":"title4"}]}';
      const json2 = '{"ts":"1668924651","user":"user2","text":"message2"}';
      const messages = [
        new Message(
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'message1',
          1,
          '1668924660',
          '2022-11-20 15:11:00',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          true,
          '1668924720',
          '2022-11-20 15:12:00',
          json1
        ),
        new Message(
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'message2',
          0,
          '',
          '',
          '[]',
          '[]',
          '[]',
          false,
          '',
          '',
          json2
        ),
      ];

      const expected = [
        [
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'message1',
          '1',
          '1668924660',
          '2022-11-20 15:11:00',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          'true',
          '1668924720',
          '2022-11-20 15:12:00',
          json1,
        ],
        [
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'message2',
          '0',
          '',
          '',
          '[]',
          '[]',
          '[]',
          'false',
          '',
          '',
          json2,
        ],
      ];
      when(dateUtilMock.createDateTimeString('1668924650')).thenReturn(
        '2022-11-20 15:10:50'
      );
      when(dateUtilMock.createDateTimeString('1668924651')).thenReturn(
        '2022-11-20 15:10:51'
      );

      // 実行
      const actual = slackTranslator.translateMessagesToArrays(messages);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateArraysToMessages のテスト', () => {
    test('arrayの配列をメッセージの配列を変換できること', () => {
      // 準備
      const json1 =
        '{"ts":"1668924650","user":"user1","text":"message1","reply_count":1,"latest_reply":"1668924660","edited":{"ts":"1668924720"},"reactions":[{"name":"reaction1","count":1},{"name":"reaction2","count":2}],"files":[{"id":"file1","name":"fileName1","mimetype":"image/png","filetype":"png","url_private_download":"https://example.com/file1","created":"1668924780"},{"id":"file2","name":"fileName2","mimetype":"image/jpeg","filetype":"jpg","url_private_download":"https://example.com/file2","created":"1668924840"}],"attachments":[{"original_url":"https://example.com/url1","title":"title1","text":"text1"},{"title":"title2","text":"text2"},{"original_url":"https://example.com/url3","text":"text3"},{"original_url":"https://example.com/url4","title":"title4"}]}';
      const json2 = '{"ts":"1668924651","user":"user2","text":"message2"}';
      const arrays = [
        [
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'message1',
          '1',
          '1668924660',
          '2022-11-20 15:11:00',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          'true',
          '1668924720',
          '2022-11-20 15:12:00',
          json1,
        ],
        [
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'message2',
          '0',
          '',
          '',
          '[]',
          '[]',
          '[]',
          'false',
          '',
          '',
          json2,
        ],
      ];
      const expected = [
        new Message(
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'message1',
          1,
          '1668924660',
          '2022-11-20 15:11:00',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          true,
          '1668924720',
          '2022-11-20 15:12:00',
          json1
        ),
        new Message(
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'message2',
          0,
          '',
          '',
          '[]',
          '[]',
          '[]',
          false,
          '',
          '',
          json2
        ),
      ];

      // 実行
      const actual = slackTranslator.translateArraysToMessages(arrays);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateToReplies のテスト', () => {
    test('リプライの配列に変換できること', () => {
      // 準備
      const entities = [
        {
          ts: '1668924651',
          user: 'user2',
          text: 'reply2',
          thread_ts: '1668924660',
        },
        {
          ts: '1668924650',
          user: 'user1',
          text: 'reply1',
          thread_ts: '1668924660',
          edited: {
            ts: '1668924720',
          },
          reactions: [
            {
              name: 'reaction1',
              count: 1,
            },
            {
              name: 'reaction2',
              count: 2,
            },
          ],
          files: [
            {
              id: 'file1',
              name: 'fileName1',
              mimetype: 'image/png',
              filetype: 'png',
              url_private_download: 'https://example.com/file1',
              created: '1668924780',
            },
            {
              id: 'file2',
              name: 'fileName2',
              mimetype: 'image/jpeg',
              filetype: 'jpg',
              url_private_download: 'https://example.com/file2',
              created: '1668924840',
            },
          ],
          attachments: [
            {
              original_url: 'https://example.com/url1',
              title: 'title1',
              text: 'text1',
            },
            { title: 'title2', text: 'text2' },
            { original_url: 'https://example.com/url3', text: 'text3' },
            { original_url: 'https://example.com/url4', title: 'title4' },
          ],
        },
      ];
      const members = [
        new Member(
          'user1',
          '',
          'userName1',
          false,
          false,
          'https://example.com/member1'
        ),
        new Member(
          'user2',
          'userName2',
          '',
          false,
          false,
          'https://example.com/member1'
        ),
      ];
      const json1 =
        '{"ts":"1668924650","user":"user1","text":"reply1","thread_ts":"1668924660","edited":{"ts":"1668924720"},"reactions":[{"name":"reaction1","count":1},{"name":"reaction2","count":2}],"files":[{"id":"file1","name":"fileName1","mimetype":"image/png","filetype":"png","url_private_download":"https://example.com/file1","created":"1668924780"},{"id":"file2","name":"fileName2","mimetype":"image/jpeg","filetype":"jpg","url_private_download":"https://example.com/file2","created":"1668924840"}],"attachments":[{"original_url":"https://example.com/url1","title":"title1","text":"text1"},{"title":"title2","text":"text2"},{"original_url":"https://example.com/url3","text":"text3"},{"original_url":"https://example.com/url4","title":"title4"}]}';
      const json2 =
        '{"ts":"1668924651","user":"user2","text":"reply2","thread_ts":"1668924660"}';
      const expected = [
        new Reply(
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'reply1',
          '1668924660',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          true,
          '1668924720',
          '2022-11-20 15:12:00',
          json1
        ),
        new Reply(
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'reply2',
          '1668924660',
          '[]',
          '[]',
          '[]',
          false,
          '',
          '',
          json2
        ),
      ];
      when(dateUtilMock.createDateTimeString('1668924650')).thenReturn(
        '2022-11-20 15:10:50'
      );
      when(dateUtilMock.createDateTimeString('1668924651')).thenReturn(
        '2022-11-20 15:10:51'
      );
      when(dateUtilMock.createDateTimeString('1668924720')).thenReturn(
        '2022-11-20 15:12:00'
      );
      when(dateUtilMock.createDateTimeString('1668924780')).thenReturn(
        '2022-11-20 15:13:00'
      );
      when(dateUtilMock.createDateTimeString('1668924840')).thenReturn(
        '2022-11-20 15:14:00'
      );

      // 実行
      const actual = slackTranslator.translateToReplies(entities, members);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateRepliesToArrays のテスト', () => {
    test('リプライの配列をarraysの配列に変換できること', () => {
      // 準備
      const json1 =
        '{"ts":"1668924650","user":"user1","text":"reply1","thread_ts":"1668924660","edited":{"ts":"1668924720"},"reactions":[{"name":"reaction1","count":1},{"name":"reaction2","count":2}],"files":[{"id":"file1","name":"fileName1","mimetype":"image/png","filetype":"png","url_private_download":"https://example.com/file1","created":"1668924780"},{"id":"file2","name":"fileName2","mimetype":"image/jpeg","filetype":"jpg","url_private_download":"https://example.com/file2","created":"1668924840"}],"attachments":[{"original_url":"https://example.com/url1","title":"title1","text":"text1"},{"title":"title2","text":"text2"},{"original_url":"https://example.com/url3","text":"text3"},{"original_url":"https://example.com/url4","title":"title4"}]}';
      const json2 =
        '{"ts":"1668924651","user":"user2","text":"reply2","thread_ts":"1668924660"}';
      const replies = [
        new Reply(
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'reply1',
          '1668924660',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          true,
          '1668924720',
          '2022-11-20 15:12:00',
          json1
        ),
        new Reply(
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'reply2',
          '1668924660',
          '[]',
          '[]',
          '[]',
          false,
          '',
          '',
          json2
        ),
      ];
      const expected = [
        [
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'reply1',
          '1668924660',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          'true',
          '1668924720',
          '2022-11-20 15:12:00',
          json1,
        ],
        [
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'reply2',
          '1668924660',
          '[]',
          '[]',
          '[]',
          'false',
          '',
          '',
          json2,
        ],
      ];

      // 実行
      const actual = slackTranslator.translateRepliesToArrays(replies);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('translateArraysToReplies のテスト', () => {
    test('arraysの配列をリプライの配列に変換できること', () => {
      // 準備
      const json1 =
        '{"ts":"1668924650","user":"user1","text":"reply1","thread_ts":"1668924660","edited":{"ts":"1668924720"},"reactions":[{"name":"reaction1","count":1},{"name":"reaction2","count":2}],"files":[{"id":"file1","name":"fileName1","mimetype":"image/png","filetype":"png","url_private_download":"https://example.com/file1","created":"1668924780"},{"id":"file2","name":"fileName2","mimetype":"image/jpeg","filetype":"jpg","url_private_download":"https://example.com/file2","created":"1668924840"}],"attachments":[{"original_url":"https://example.com/url1","title":"title1","text":"text1"},{"title":"title2","text":"text2"},{"original_url":"https://example.com/url3","text":"text3"},{"original_url":"https://example.com/url4","title":"title4"}]}';
      const json2 =
        '{"ts":"1668924651","user":"user2","text":"reply2","thread_ts":"1668924660"}';
      const arrays = [
        [
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'reply1',
          '1668924660',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          'true',
          '1668924720',
          '2022-11-20 15:12:00',
          json1,
        ],
        [
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'reply2',
          '1668924660',
          '[]',
          '[]',
          '[]',
          'false',
          '',
          '',
          json2,
        ],
      ];
      const expected = [
        new Reply(
          '1668924650',
          '2022-11-20 15:10:50',
          'user1',
          'userName1',
          'reply1',
          '1668924660',
          '[{"name":"reaction1","count":1},{"name":"reaction2","count":2}]',
          '[' +
            '{"id":"file1","created":"2022-11-20 15:13:00","name":"fileName1","mimeType":"image/png","fileType":"png","downloadUrl":"https://example.com/file1"},' +
            '{"id":"file2","created":"2022-11-20 15:14:00","name":"fileName2","mimeType":"image/jpeg","fileType":"jpg","downloadUrl":"https://example.com/file2"}' +
            ']',
          '[' +
            '{"url":"https://example.com/url1","title":"title1","text":"text1"},' +
            '{"url":"","title":"title2","text":"text2"},' +
            '{"url":"https://example.com/url3","title":"","text":"text3"},' +
            '{"url":"https://example.com/url4","title":"title4","text":""}' +
            ']',
          true,
          '1668924720',
          '2022-11-20 15:12:00',
          json1
        ),
        new Reply(
          '1668924651',
          '2022-11-20 15:10:51',
          'user2',
          'userName2',
          'reply2',
          '1668924660',
          '[]',
          '[]',
          '[]',
          false,
          '',
          '',
          json2
        ),
      ];

      // 実行
      const actual = slackTranslator.translateArraysToReplies(arrays);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
