import { DateUtil } from './DateUtil';
import { inject, injectable } from 'inversify';
import { MessageStatus } from '../entity/MessageStatus';
import { ReplyStatus } from '../entity/ReplyStatus';
import { SlackTranslator } from './SlackTranslator';
import { SpreadSheetManager } from './SpreadSheetManager';
import { SpreadSheetType } from '../types/SpreadSheetType';
import PropertyType from '../types/PropertyType';
import PropertyUtil from './PropertyUtil';
import Types from '../types/Types';

@injectable()
export class ChannelUtil {
  private dateUtil: DateUtil;
  private spreadSheetManager: SpreadSheetManager;
  private propertyUtil: PropertyUtil;
  private slackTranslator: SlackTranslator;

  constructor(
    @inject(Types.DateUtil) dateUtil: DateUtil,
    @inject(Types.SpreadSheetManager) spreadSheetManager: SpreadSheetManager,
    @inject(Types.PropertyUtil) propertyUtil: PropertyUtil,
    @inject(Types.SlackTranslator) slackTranslator: SlackTranslator
  ) {
    this.dateUtil = dateUtil;
    this.spreadSheetManager = spreadSheetManager;
    this.propertyUtil = propertyUtil;
    this.slackTranslator = slackTranslator;
  }

  /**
   * messagesのターゲットとなるチャンネルIDを取得する
   *
   * @returns チャンネルID
   */
  public getMessageTargetChannelId(): string {
    // messageStatusをロードする
    let messageStatuses: MessageStatus[] = [];

    if (
      this.spreadSheetManager.exists(
        this.propertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.MessageStatus
      )
    ) {
      const arrayMessageStatuses = this.spreadSheetManager.load(
        this.propertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.MessageStatus
      );

      messageStatuses =
        this.slackTranslator.translateArraysToMessageStatus(
          arrayMessageStatuses
        );
    }

    // channels スプレッドシートがない場合は空のチャンネルID を返す
    if (
      !this.spreadSheetManager.exists(
        this.propertyUtil.getProperty(PropertyType.MembersFolerId),
        SpreadSheetType.Channels
      )
    ) {
      return '';
    }

    // チャンネル一覧をロードする
    const arrayChannels = this.spreadSheetManager.load(
      this.propertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    );
    const channels =
      this.slackTranslator.translateArraysToChannels(arrayChannels);

    // 現在年月日を取得する
    const currentDateNumber = this.dateUtil.getCurrentDateNumber(); // yyyyMMddの数値

    let channelId;

    for (const channel of channels) {
      // messageStatusに存在しないチャンネルIDは即座に返す
      const messageStatusCount = messageStatuses.filter(
        (messageStatus) => messageStatus.channelId === channel.id
      ).length;

      if (messageStatusCount === 0) {
        channelId = channel.id;
        break;
      }

      // 当日処理されていないチャンネルIDを取得する
      channelId = messageStatuses.find(
        (messageStatus) =>
          messageStatus.channelId === channel.id &&
          this.dateUtil.createDateNumber(messageStatus.ts) < currentDateNumber
      )?.channelId;

      if (channelId) {
        break;
      }
    }

    // チャンネルIDが取得できない場合は空文字を返す
    return channelId || '';
  }

  /**
   * repliesのターゲットとなるチャンネルIDを取得する
   *
   * @returns チャンネルID
   */
  public getReplyTargetChannelId(): string {
    // replyStatusをロードする
    let replyStatuses: ReplyStatus[] = [];

    if (
      this.spreadSheetManager.exists(
        this.propertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.RepliesStatus
      )
    ) {
      const arrayReplyStatuses = this.spreadSheetManager.load(
        this.propertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.RepliesStatus
      );

      replyStatuses =
        this.slackTranslator.translateArraysToReplyStatus(arrayReplyStatuses);
    }

    // channels スプレッドシートがない場合は空のチャンネルID を返す
    if (
      !this.spreadSheetManager.exists(
        this.propertyUtil.getProperty(PropertyType.MembersFolerId),
        SpreadSheetType.Channels
      )
    ) {
      return '';
    }

    // チャンネル一覧をロードする
    const arrayChannels = this.spreadSheetManager.load(
      this.propertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    );
    const channels =
      this.slackTranslator.translateArraysToChannels(arrayChannels);

    // 現在年月日を取得する
    const currentDateNumber = this.dateUtil.getCurrentDateNumber(); // yyyyMMddの数値

    let channelId;

    for (const channel of channels) {
      // replytatusに存在しないチャンネルIDは即座に返す
      const replyStatusCount = replyStatuses.filter(
        (replyStatus) => replyStatus.channelId === channel.id
      ).length;

      if (replyStatusCount === 0) {
        channelId = channel.id;
        break;
      }

      // 当日処理されていないチャンネルIDを取得する
      channelId = replyStatuses.find(
        (replyStatus) =>
          replyStatus.channelId === channel.id &&
          this.dateUtil.createDateNumber(replyStatus.ts) < currentDateNumber
      )?.channelId;

      if (channelId) {
        break;
      }
    }

    // チャンネルIDが取得できない場合は空文字を返す
    return channelId || '';
  }
}
