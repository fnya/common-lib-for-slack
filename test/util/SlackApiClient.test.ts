import 'reflect-metadata';
import { Container } from 'inversify';
import { describe, test, beforeEach, expect } from '@jest/globals';
import { mock, instance, when, anything, deepEqual, verify } from 'ts-mockito';
import { SlackApiClient } from '../../src/lib/util/SlackApiClient';
import Types from '../../src/lib/types/Types';
import { UrlFetchAppUtil } from '../../src/lib/util/UrlFetchAppUtil';
import PropertyUtil from '../../src/lib/util/PropertyUtil';
import PropertyType from '../../src/lib/types/PropertyType';
import { PermissionTypes } from '../../src/lib/types/PermissionTypes';

describe('SlackApiClient のテスト', () => {
  let container: Container;
  let propertyUtilMock: PropertyUtil;
  let urlFetchAppUtilMock: UrlFetchAppUtil;
  let slackApiClient: SlackApiClient;

  beforeEach(() => {
    // inversify の初期化
    container = new Container();
    propertyUtilMock = mock(PropertyUtil);
    urlFetchAppUtilMock = mock(UrlFetchAppUtil);

    container
      .bind<PropertyUtil>(Types.PropertyUtil)
      .toConstantValue(instance(propertyUtilMock));
    container
      .bind<UrlFetchAppUtil>(Types.UrlFetchAppUtil)
      .toConstantValue(instance(urlFetchAppUtilMock));

    container.bind<SlackApiClient>(Types.SlackApiClient).to(SlackApiClient);

    slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);
  });

  afterEach(() => {
    // Dateのモックを元に戻す
    jest.useRealTimers();
  });

  describe('getChannels のテスト', () => {
    test('チャンネル一覧を取得できること', () => {
      // 準備
      const permissions = [
        PermissionTypes.PublicChannel,
        PermissionTypes.PrivateChannel,
      ];
      const url =
        'https://slack.com/api/conversations.list?types=public_channel%2Cprivate_channel';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = [];
      const response = { channels: expected };

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );
      when(urlFetchAppUtilMock.getContent(url, deepEqual(options))).thenReturn(
        response
      );

      // 実行
      const actual = slackApiClient.getChannels(permissions);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('getMembers のテスト', () => {
    test('メンバー一覧を取得できること', () => {
      // 準備
      const url = 'https://slack.com/api/users.list';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = [];
      const response = { members: expected };

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );
      when(urlFetchAppUtilMock.getContent(url, deepEqual(options))).thenReturn(
        response
      );

      // 実行
      const actual = slackApiClient.getMembers();

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('getMessages のテスト', () => {
    test('指定したチャンネルのメッセージ一覧を取得できること 1ページ', () => {
      // 準備
      const mockDate = new Date(2022, 10, 5, 1, 2, 3); // 2022-11-05 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // -90day 2022-8-7 1659801723
      const url =
        'https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=1659801723';
      const channelId = 'channelA';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = [{ ts: '1' }, { ts: '2' }];
      const response = {
        messages: [{ ts: '2' }, { ts: '1' }],
        has_more: false,
      };

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );
      when(urlFetchAppUtilMock.getContent(url, deepEqual(options))).thenReturn(
        response
      );

      // 実行
      const actual = slackApiClient.getMessages(channelId);

      // 検証
      expect(actual).toEqual(expected);
    });

    test('指定したチャンネルのメッセージ一覧を取得できること 2ページ', () => {
      // 準備
      const mockDate = new Date(2022, 10, 5, 1, 2, 3); // 2022-11-05 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // -90day 2022-8-7 1659801723
      const url1 =
        'https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=1659801723';
      const url2 =
        'https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=10';
      const channelId = 'channelA';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = [
        { ts: '1' },
        { ts: '2' },
        { ts: '3' },
        { ts: '4' },
        { ts: '5' },
        { ts: '6' },
        { ts: '7' },
        { ts: '8' },
        { ts: '9' },
        { ts: '10' },
        { ts: '11' },
      ];
      const responsePage1 = {
        messages: [
          { ts: '10' },
          { ts: '9' },
          { ts: '8' },
          { ts: '7' },
          { ts: '6' },
          { ts: '5' },
          { ts: '4' },
          { ts: '3' },
          { ts: '2' },
          { ts: '1' },
        ],
        has_more: true,
      };
      const responsePage2 = {
        messages: [{ ts: '11' }],
        has_more: false,
      };

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );
      when(urlFetchAppUtilMock.getContent(url1, deepEqual(options))).thenReturn(
        responsePage1
      );
      when(urlFetchAppUtilMock.getContent(url2, deepEqual(options))).thenReturn(
        responsePage2
      );

      // 実行
      const actual = slackApiClient.getMessages(channelId);

      // 検証
      expect(actual).toEqual(expected);
    });

    test('指定したチャンネルのメッセージ一覧を取得できること 最大ページを超えた場合は後続処理をスキップする', () => {
      // 準備
      const mockDate = new Date(2022, 10, 5, 1, 2, 3); // 2022-11-05 01:02:03, -90day -> 2022-8-7 1659801723
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const channelId = 'channelA';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = createExpected();

      // mock
      const url0 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=1659801723`;
      const response0 = createResponse('0', true);
      when(urlFetchAppUtilMock.getContent(url0, deepEqual(options))).thenReturn(
        response0
      );
      const url1 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=0`;
      const response1 = createResponse('1', true);
      when(urlFetchAppUtilMock.getContent(url1, deepEqual(options))).thenReturn(
        response1
      );
      const url2 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=1`;
      const response2 = createResponse('2', true);
      when(urlFetchAppUtilMock.getContent(url2, deepEqual(options))).thenReturn(
        response2
      );
      const url3 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=2`;
      const response3 = createResponse('3', true);
      when(urlFetchAppUtilMock.getContent(url3, deepEqual(options))).thenReturn(
        response3
      );
      const url4 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=3`;
      const response4 = createResponse('4', true);
      when(urlFetchAppUtilMock.getContent(url4, deepEqual(options))).thenReturn(
        response4
      );
      const url5 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=4`;
      const response5 = createResponse('5', true);
      when(urlFetchAppUtilMock.getContent(url5, deepEqual(options))).thenReturn(
        response5
      );
      const url6 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=5`;
      const response6 = createResponse('6', true);
      when(urlFetchAppUtilMock.getContent(url6, deepEqual(options))).thenReturn(
        response6
      );
      const url7 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=6`;
      const response7 = createResponse('7', true);
      when(urlFetchAppUtilMock.getContent(url7, deepEqual(options))).thenReturn(
        response7
      );
      const url8 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=7`;
      const response8 = createResponse('8', true);
      when(urlFetchAppUtilMock.getContent(url8, deepEqual(options))).thenReturn(
        response8
      );
      const url9 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=8`;
      const response9 = createResponse('9', true);
      when(urlFetchAppUtilMock.getContent(url9, deepEqual(options))).thenReturn(
        response9
      );
      const url10 = `https://slack.com/api/conversations.history?channel=channelA&limit=1000&oldest=9`;
      const response10 = createResponse('10', true);
      when(
        urlFetchAppUtilMock.getContent(url10, deepEqual(options))
      ).thenReturn(response10);

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );

      // 実行
      const actual = slackApiClient.getMessages(channelId);

      // 検証
      expect(actual).toEqual(expected);
      verify(urlFetchAppUtilMock.getContent(url9, deepEqual(options))).once();
      verify(urlFetchAppUtilMock.getContent(url10, deepEqual(options))).never();
    });

    const createResponse = (ts: string, hasMore: boolean): any => {
      return {
        messages: [{ ts }],
        // eslint-disable-next-line camelcase
        has_more: hasMore,
      };
    };

    const createExpected = (): any[] => {
      const entities: any[] = [];
      for (let i = 0; entities.length < 10; i++) {
        const entity = { ts: String(i) };
        entities.push(entity);
      }
      return entities;
    };
  });

  describe('getReplies のテスト', () => {
    test('指定したチャンネルとメッセージ(ts)のリプライ一覧を取得できること 1ページ', () => {
      // 準備
      const url =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=1667577723';
      const channelId = 'channelA';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = [{ ts: '1' }, { ts: '2' }];
      const response = {
        messages: [{ ts: '1667577723' }, { ts: '2' }, { ts: '1' }],
        has_more: false,
      };

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );
      when(urlFetchAppUtilMock.getContent(url, deepEqual(options))).thenReturn(
        response
      );

      // 実行
      const actual = slackApiClient.getReplies(channelId, '1667577723');

      // 検証
      expect(actual).toEqual(expected);
    });

    test('指定したチャンネルとメッセージ(ts)のリプライ一覧を取得できること 2ページ', () => {
      // 準備
      const url1 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=1667577723';
      const url2 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=2';
      const channelId = 'channelA';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = [{ ts: '1' }, { ts: '2' }, { ts: '3' }, { ts: '4' }];
      const response1 = {
        messages: [{ ts: '1667577723' }, { ts: '1' }, { ts: '2' }],
        has_more: true,
      };
      const response2 = {
        messages: [{ ts: '1667577723' }, { ts: '3' }, { ts: '4' }],
        has_more: false,
      };

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );
      when(urlFetchAppUtilMock.getContent(url1, deepEqual(options))).thenReturn(
        response1
      );
      when(urlFetchAppUtilMock.getContent(url2, deepEqual(options))).thenReturn(
        response2
      );

      // 実行
      const actual = slackApiClient.getReplies(channelId, '1667577723');

      // 検証
      expect(actual).toEqual(expected);
    });

    test('指定したチャンネルとメッセージ(ts)のリプライ一覧を取得できること 最大ページを超えた場合は後続処理をスキップする', () => {
      // 準備
      const channelId = 'channelA';
      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };
      const expected = createExpected();

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );

      const url0 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=1667577723';
      const response0 = createResponse('0', true);
      when(urlFetchAppUtilMock.getContent(url0, deepEqual(options))).thenReturn(
        response0
      );
      const url1 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=0';
      const response1 = createResponse('1', true);
      when(urlFetchAppUtilMock.getContent(url1, deepEqual(options))).thenReturn(
        response1
      );
      const url2 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=1';
      const response2 = createResponse('2', true);
      when(urlFetchAppUtilMock.getContent(url2, deepEqual(options))).thenReturn(
        response2
      );
      const url3 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=2';
      const response3 = createResponse('3', true);
      when(urlFetchAppUtilMock.getContent(url3, deepEqual(options))).thenReturn(
        response3
      );
      const url4 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=3';
      const response4 = createResponse('4', true);
      when(urlFetchAppUtilMock.getContent(url4, deepEqual(options))).thenReturn(
        response4
      );
      const url5 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=4';
      const response5 = createResponse('5', true);
      when(urlFetchAppUtilMock.getContent(url5, deepEqual(options))).thenReturn(
        response5
      );
      const url6 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=5';
      const response6 = createResponse('6', true);
      when(urlFetchAppUtilMock.getContent(url6, deepEqual(options))).thenReturn(
        response6
      );
      const url7 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=6';
      const response7 = createResponse('7', true);
      when(urlFetchAppUtilMock.getContent(url7, deepEqual(options))).thenReturn(
        response7
      );
      const url8 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=7';
      const response8 = createResponse('8', true);
      when(urlFetchAppUtilMock.getContent(url8, deepEqual(options))).thenReturn(
        response8
      );
      const url9 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=8';
      const response9 = createResponse('9', true);
      when(urlFetchAppUtilMock.getContent(url9, deepEqual(options))).thenReturn(
        response9
      );
      const url10 =
        'https://slack.com/api/conversations.replies?channel=channelA&ts=1667577723&limit=1000&oldest=9';
      const response10 = createResponse('10', true);
      when(
        urlFetchAppUtilMock.getContent(url10, deepEqual(options))
      ).thenReturn(response10);

      // 実行
      const actual = slackApiClient.getReplies(channelId, '1667577723');

      // 検証
      expect(actual).toEqual(expected);
      verify(urlFetchAppUtilMock.getContent(url9, deepEqual(options))).once();
      verify(urlFetchAppUtilMock.getContent(url10, deepEqual(options))).never();
    });

    const createResponse = (ts: string, hasMore: boolean): any => {
      return {
        messages: [{ ts }, { ts }],
        // eslint-disable-next-line camelcase
        has_more: hasMore,
      };
    };

    const createExpected = (): any[] => {
      const entities: any[] = [];
      for (let i = 0; entities.length < 10; i++) {
        const entity = { ts: String(i) };
        entities.push(entity);
      }
      return entities;
    };
  });

  describe('downloadFile のテスト', () => {
    test('ファイルのダウンロードが行われること', () => {
      // 準備
      const folderId = 'folderId';
      const downloadUrl = 'https://example.com/download';
      const fileName = 'fileName';

      const options = {
        headers: {
          Authorization: 'Bearer slackApiToken',
        },
      };

      when(propertyUtilMock.getProperty(PropertyType.SlackApiToken)).thenReturn(
        'slackApiToken'
      );

      // 実行
      slackApiClient.downloadFile(folderId, downloadUrl, fileName);

      // 検証
      verify(
        urlFetchAppUtilMock.downloadFile(
          downloadUrl,
          deepEqual(options),
          folderId,
          fileName
        )
      ).once();
    });
  });
});
