/* eslint-disable no-undef */
import { inject, injectable } from 'inversify';
import { IChannelUtil } from '../interface/IChannelUtil';
import { IDateUtil } from '../interface/IDateUtil';
import { ISpreadSheetManager } from '../interface/ISpreadSheetManager';
import { ISlackTranslator } from '../interface/ISlackTranslator';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import { SpreadSheetType } from '../types/SpreadSheetType';

import PropertyType from '../types/PropertyType';
import Types from '../types/Types';
import { MessageStatus } from '../entity/MessageStatus';
import { ReplyStatus } from '../entity/ReplyStatus';

@injectable()
export class ChannelUtil implements IChannelUtil {
  private iDateUtil: IDateUtil;
  private iSpreadSheetManager: ISpreadSheetManager;
  private iPropertyUtil: IPropertyUtil;
  private iSlackTranslator: ISlackTranslator;

  public constructor(
    @inject(Types.IDateUtil) iDateUtil: IDateUtil,
    @inject(Types.ISpreadSheetManager) iSpreadSheetManager: ISpreadSheetManager,
    @inject(Types.IPropertyUtil) iPropertyUtil: IPropertyUtil,
    @inject(Types.ISlackTranslator) iSlackTranslator: ISlackTranslator
  ) {
    this.iDateUtil = iDateUtil;
    this.iSpreadSheetManager = iSpreadSheetManager;
    this.iPropertyUtil = iPropertyUtil;
    this.iSlackTranslator = iSlackTranslator;
  }

  /**
   * membersのターゲットとなるチャンネルIDを取得する
   *
   * @returns チャンネルID
   */
  public getMemberTargetChannelId(): string {
    // messageStatusをロードする
    let messageStatuses: MessageStatus[] = [];

    if (
      this.iSpreadSheetManager.exists(
        this.iPropertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.MessageStatus
      )
    ) {
      const arrayMessageStatuses = this.iSpreadSheetManager.load(
        this.iPropertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.MessageStatus
      );

      messageStatuses =
        this.iSlackTranslator.translateArraysToMessageStatus(
          arrayMessageStatuses
        );
    }

    // チャンネル一覧をロードする
    const arrayChannels = this.iSpreadSheetManager.load(
      this.iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    );
    const channels =
      this.iSlackTranslator.translateArraysToChannels(arrayChannels);

    // 現在年月日を取得する
    const currentDateNumber = this.iDateUtil.getCurrentDateNumber(); // yyyyMMddの数値

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
          this.iDateUtil.createDateNumber(messageStatus.ts) < currentDateNumber
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
      this.iSpreadSheetManager.exists(
        this.iPropertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.RepliesStatus
      )
    ) {
      const arrayReplyStatuses = this.iSpreadSheetManager.load(
        this.iPropertyUtil.getProperty(PropertyType.SystemFolerId),
        SpreadSheetType.RepliesStatus
      );

      replyStatuses =
        this.iSlackTranslator.translateArraysToReplyStatus(arrayReplyStatuses);
    }

    // チャンネル一覧をロードする
    const arrayChannels = this.iSpreadSheetManager.load(
      this.iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    );
    const channels =
      this.iSlackTranslator.translateArraysToChannels(arrayChannels);

    // 現在年月日を取得する
    const currentDateNumber = this.iDateUtil.getCurrentDateNumber(); // yyyyMMddの数値

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
          this.iDateUtil.createDateNumber(replyStatus.ts) < currentDateNumber
      )?.channelId;

      if (channelId) {
        break;
      }
    }

    // チャンネルIDが取得できない場合は空文字を返す
    return channelId || '';
  }
}
