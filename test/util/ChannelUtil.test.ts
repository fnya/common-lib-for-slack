import 'reflect-metadata';
import { Container } from 'inversify';
import { describe, test, beforeEach, expect } from '@jest/globals';
import { mock, instance, when } from 'ts-mockito';
import { ChannelUtil } from '../../src/lib/util/ChannelUtil';
import Types from '../../src/lib/types/Types';
import { DateUtil } from '../../src/lib/util/DateUtil';
import { SlackTranslator } from '../../src/lib/util/SlackTranslator';
import { SpreadSheetManager } from '../../src/lib/util/SpreadSheetManager';
import PropertyUtil from '../../src/lib/util/PropertyUtil';
import PropertyType from '../../src/lib/types/PropertyType';
import { SpreadSheetType } from '../../src/lib/types/SpreadSheetType';

describe('ChannelUtil のテスト', () => {
  let container: Container;
  let channelUtil: ChannelUtil;
  let spreadSheetManagerMock: SpreadSheetManager;
  let propertyUtilMock: PropertyUtil;

  beforeEach(() => {
    // inversify の初期化
    container = new Container();
    spreadSheetManagerMock = mock(SpreadSheetManager);
    propertyUtilMock = mock(PropertyUtil);

    container
      .bind<SpreadSheetManager>(Types.SpreadSheetManager)
      .toConstantValue(instance(spreadSheetManagerMock));
    container
      .bind<PropertyUtil>(Types.PropertyUtil)
      .toConstantValue(instance(propertyUtilMock));

    container.bind<SlackTranslator>(Types.SlackTranslator).to(SlackTranslator);
    container.bind<DateUtil>(Types.DateUtil).to(DateUtil);
    container.bind<ChannelUtil>(Types.ChannelUtil).to(ChannelUtil);

    channelUtil = container.get<ChannelUtil>(Types.ChannelUtil);
  });

  afterEach(() => {
    // Dateのモックを元に戻す
    jest.useRealTimers();
  });

  describe('getMemberTargetChannelId のテスト', () => {
    test('チャンネルIDを取得できること', () => {
      // 準備
      const mockDate = new Date(2022, 10, 11, 5, 2, 3); // 2022-11-11 05:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const arrayMessageStatuses = [
        ['channelId1', '1668095038.735', '2022-11-11 00:43:58'],
        ['channelId2', '1668105826.244', '2022-11-11 03:43:46'],
        ['channelId3', '1668006061.244', '2022-11-10 00:01:01'],
      ];
      const arrayChannels = [
        ['channelId1', 'title1', 'false', 'text1', 'text2'],
        ['channelId2', 'title2', 'false', 'text1', 'text2'],
        ['channelId3', 'title3', 'false', 'text1', 'text2'],
      ];

      when(propertyUtilMock.getProperty(PropertyType.SystemFolerId)).thenReturn(
        'SystemFolerId'
      );
      when(
        spreadSheetManagerMock.exists(
          'SystemFolerId',
          SpreadSheetType.MessageStatus
        )
      ).thenReturn(true);
      when(
        spreadSheetManagerMock.load(
          'SystemFolerId',
          SpreadSheetType.MessageStatus
        )
      ).thenReturn(arrayMessageStatuses);
      when(
        propertyUtilMock.getProperty(PropertyType.MembersFolerId)
      ).thenReturn('MembersFolerId');
      when(
        spreadSheetManagerMock.load('MembersFolerId', SpreadSheetType.Channels)
      ).thenReturn(arrayChannels);

      // 実行
      const actual = channelUtil.getMessageTargetChannelId();

      // 検証
      expect(actual).toEqual('channelId3');
    });
  });

  test('MessageStatusがない場合は最初のチャンネルIDが返ること', () => {
    // 準備
    const mockDate = new Date(2022, 10, 11, 5, 2, 3); // 2022-11-11 05:02:03
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const arrayChannels = [
      ['channelId1', 'title1', 'false', 'text1', 'text2'],
      ['channelId2', 'title2', 'false', 'text1', 'text2'],
      ['channelId3', 'title3', 'false', 'text1', 'text2'],
    ];

    when(propertyUtilMock.getProperty(PropertyType.SystemFolerId)).thenReturn(
      'SystemFolerId'
    );
    when(
      spreadSheetManagerMock.exists(
        'SystemFolerId',
        SpreadSheetType.MessageStatus
      )
    ).thenReturn(false);
    when(propertyUtilMock.getProperty(PropertyType.MembersFolerId)).thenReturn(
      'MembersFolerId'
    );
    when(
      spreadSheetManagerMock.load('MembersFolerId', SpreadSheetType.Channels)
    ).thenReturn(arrayChannels);

    // 実行
    const actual = channelUtil.getMessageTargetChannelId();

    // 検証
    expect(actual).toEqual('channelId1');
  });

  test('当日のチャンネルIDが全て処理済みの場合は空文字が返ること', () => {
    // 準備
    const mockDate = new Date(2022, 10, 11, 5, 2, 3); // 2022-11-11 05:02:03
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const arrayMessageStatuses = [
      ['channelId1', '1668095038.735', '2022-11-11 00:43:58'],
      ['channelId2', '1668105826.244', '2022-11-11 03:43:46'],
      ['channelId3', '1668092701.244', '2022-11-11 05:01:01'],
    ];
    const arrayChannels = [
      ['channelId1', 'title1', 'false', 'text1', 'text2'],
      ['channelId2', 'title2', 'false', 'text1', 'text2'],
      ['channelId3', 'title3', 'false', 'text1', 'text2'],
    ];

    when(propertyUtilMock.getProperty(PropertyType.SystemFolerId)).thenReturn(
      'SystemFolerId'
    );
    when(
      spreadSheetManagerMock.exists(
        'SystemFolerId',
        SpreadSheetType.MessageStatus
      )
    ).thenReturn(true);
    when(
      spreadSheetManagerMock.load(
        'SystemFolerId',
        SpreadSheetType.MessageStatus
      )
    ).thenReturn(arrayMessageStatuses);
    when(propertyUtilMock.getProperty(PropertyType.MembersFolerId)).thenReturn(
      'MembersFolerId'
    );
    when(
      spreadSheetManagerMock.load('MembersFolerId', SpreadSheetType.Channels)
    ).thenReturn(arrayChannels);

    // 実行
    const actual = channelUtil.getMessageTargetChannelId();

    // 検証
    expect(actual).toEqual('');
  });

  describe('getReplyTargetChannelId のテスト', () => {
    test('チャンネルIDを取得できること', () => {
      // 準備
      const mockDate = new Date(2022, 10, 11, 5, 2, 3); // 2022-11-11 05:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const arrayReplyStatuses = [
        ['channelId1', '1668095038.735', '2022-11-11 00:43:58'],
        ['channelId2', '1668105826.244', '2022-11-11 03:43:46'],
        ['channelId3', '1668006061.244', '2022-11-10 00:01:01'],
      ];
      const arrayChannels = [
        ['channelId1', 'title1', 'false', 'text1', 'text2'],
        ['channelId2', 'title2', 'false', 'text1', 'text2'],
        ['channelId3', 'title3', 'false', 'text1', 'text2'],
      ];

      when(propertyUtilMock.getProperty(PropertyType.SystemFolerId)).thenReturn(
        'SystemFolerId'
      );
      when(
        spreadSheetManagerMock.exists(
          'SystemFolerId',
          SpreadSheetType.RepliesStatus
        )
      ).thenReturn(true);
      when(
        spreadSheetManagerMock.load(
          'SystemFolerId',
          SpreadSheetType.RepliesStatus
        )
      ).thenReturn(arrayReplyStatuses);
      when(
        propertyUtilMock.getProperty(PropertyType.MembersFolerId)
      ).thenReturn('MembersFolerId');
      when(
        spreadSheetManagerMock.load('MembersFolerId', SpreadSheetType.Channels)
      ).thenReturn(arrayChannels);

      // 実行
      const actual = channelUtil.getReplyTargetChannelId();

      // 検証
      expect(actual).toEqual('channelId3');
    });

    test('ReplyStatusがない場合は最初のチャンネルIDが返ること', () => {
      // 準備
      const mockDate = new Date(2022, 10, 11, 5, 2, 3); // 2022-11-11 05:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const arrayChannels = [
        ['channelId1', 'title1', 'false', 'text1', 'text2'],
        ['channelId2', 'title2', 'false', 'text1', 'text2'],
        ['channelId3', 'title3', 'false', 'text1', 'text2'],
      ];

      when(propertyUtilMock.getProperty(PropertyType.SystemFolerId)).thenReturn(
        'SystemFolerId'
      );
      when(
        spreadSheetManagerMock.exists(
          'SystemFolerId',
          SpreadSheetType.RepliesStatus
        )
      ).thenReturn(false);
      when(
        propertyUtilMock.getProperty(PropertyType.MembersFolerId)
      ).thenReturn('MembersFolerId');
      when(
        spreadSheetManagerMock.load('MembersFolerId', SpreadSheetType.Channels)
      ).thenReturn(arrayChannels);

      // 実行
      const actual = channelUtil.getReplyTargetChannelId();

      // 検証
      expect(actual).toEqual('channelId1');
    });

    test('当日のチャンネルIDが全て処理済みの場合は空文字が返ること', () => {
      // 準備
      const mockDate = new Date(2022, 10, 11, 5, 2, 3); // 2022-11-11 05:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const arrayReplyStatuses = [
        ['channelId1', '1668095038.735', '2022-11-11 00:43:58'],
        ['channelId2', '1668105826.244', '2022-11-11 03:43:46'],
        ['channelId3', '1668092701.244', '2022-11-11 05:01:01'],
      ];
      const arrayChannels = [
        ['channelId1', 'title1', 'false', 'text1', 'text2'],
        ['channelId2', 'title2', 'false', 'text1', 'text2'],
        ['channelId3', 'title3', 'false', 'text1', 'text2'],
      ];

      when(propertyUtilMock.getProperty(PropertyType.SystemFolerId)).thenReturn(
        'SystemFolerId'
      );
      when(
        spreadSheetManagerMock.exists(
          'SystemFolerId',
          SpreadSheetType.RepliesStatus
        )
      ).thenReturn(true);
      when(
        spreadSheetManagerMock.load(
          'SystemFolerId',
          SpreadSheetType.RepliesStatus
        )
      ).thenReturn(arrayReplyStatuses);
      when(
        propertyUtilMock.getProperty(PropertyType.MembersFolerId)
      ).thenReturn('MembersFolerId');
      when(
        spreadSheetManagerMock.load('MembersFolerId', SpreadSheetType.Channels)
      ).thenReturn(arrayChannels);

      // 実行
      const actual = channelUtil.getReplyTargetChannelId();

      // 検証
      expect(actual).toEqual('');
    });
  });
});
