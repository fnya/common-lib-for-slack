/* eslint-disable no-undef */
import { GoogleDrive } from './GoogleDrive';
import { inject, injectable } from 'inversify';
import { PermissionTypes } from '../types/PermissionTypes';
import { SlackApiType } from '../types/SlackApiType';
import PropertyType from '../types/PropertyType';
import PropertyUtil from './PropertyUtil';
import Types from '../types/Types';

@injectable()
export class SlackApiClient {
  private static SLACK_API_URL = 'https://slack.com/api/';
  private static MAX_PAGINATION = 10;
  private static LIMIT_PER_REQUEST = 1000;
  private static OLDEST_MESSAGE_DAY = 90; // メッセージを何日前から取得するか設定
  private propertyUtil: PropertyUtil;
  private googleDrive: GoogleDrive;

  public constructor(
    @inject(Types.PropertyUtil) propertyUtil: PropertyUtil,
    @inject(Types.GoogleDrive) googleDrive: GoogleDrive
  ) {
    this.propertyUtil = propertyUtil;
    this.googleDrive = googleDrive;
  }

  /**
   * チャンネル一覧を取得する
   *
   * @returns チャンネル一覧
   */
  public getChannels(permissions: PermissionTypes[]): any[] {
    const permission = permissions.join(',');
    const options = { types: permission };
    return this.getSlackApiData(SlackApiType.Channels, options).channels;
  }

  /**
   * メンバー一覧を取得する
   *
   * @returns メンバー一覧
   */
  public getMembers(): any[] {
    return this.getSlackApiData(SlackApiType.Members).members;
  }

  /**
   * チャンネルごとのメッセージ一覧を取得する
   *
   * @param channelId チャンネルID
   * @param ts 最も古いタイムスタンプ
   * @returns チャンネルごとのメッセージ一覧
   */
  public getMessages(channelId: string, ts?: string): any[] {
    let messages: any[] = [];
    let response: any = {};
    let currentPage = 1;

    while (
      (!('has_more' in response) || response.has_more) &&
      currentPage <= SlackApiClient.MAX_PAGINATION
    ) {
      const oldest = this.createMessagesOldest(currentPage, response, ts);

      // Slack API呼び出し
      response = this.getSlackApiData(
        SlackApiType.Messages,
        this.createMessagesOptions(channelId, oldest)
      );

      messages = messages.concat(response.messages);
      currentPage++;
    }

    // 最新メッセージを一番下にする
    return messages.sort((a, b) => Number(a.ts) - Number(b.ts));
  }

  /**
   * リプライ一覧を取得する(全件取得し直し)
   *
   * @param channelId チャンネルID
   * @param parentTs 親スレッドのタイムスタンプ
   * @returns リプライ一覧
   */
  public getReplies(channelId: string, parentTs: string): any[] {
    let replies: any[] = [];
    let response: any = {};
    let currentPage = 1;

    while (
      (!('has_more' in response) || response.has_more) &&
      currentPage <= SlackApiClient.MAX_PAGINATION
    ) {
      const oldest = this.createRepliesOldest(currentPage, response, parentTs);

      // Slack API呼び出し
      response = this.getSlackApiData(
        SlackApiType.Replies,
        this.createRepliesOptions(channelId, parentTs, oldest)
      );

      // 0.5秒ウェイト
      Utilities.sleep(500);

      // 親スレッドの内容を削除する
      response.messages.shift();

      replies = replies.concat(response.messages);
      currentPage++;
    }

    // 最新リプライを一番下にする
    return replies.sort((a, b) => Number(a.ts) - Number(b.ts));
  }

  /**
   * ファイルをダウンロードする
   *
   * @param folderId フォルダID
   * @param downloadUrl ダウンロードURL
   * @param fileId ファイルID
   */
  public downloadFile(
    folderId: string,
    downloadUrl: string,
    fileId: string
  ): void {
    const options = {
      headers: {
        Authorization: 'Bearer ' + this.getProperty(PropertyType.SlackApiToken),
      },
    };

    // ファイル取得
    const response = UrlFetchApp.fetch(downloadUrl, options);
    const blob = response.getBlob().setName(fileId);

    const folder = this.googleDrive.getFolder(folderId);

    // 既にファイルが存在していたら削除
    const it = folder.getFilesByName(fileId);
    if (it.hasNext()) {
      folder.removeFile(it.next());
    }

    // ファイル作成
    folder.createFile(blob);
  }

  /**
   * メッセージのoldestを作成
   *
   * @param currentPage 現在ページ
   * @param response レスポンス
   * @param ts タイムスタンプ
   * @returns メッセージのoldest
   */
  private createMessagesOldest(
    currentPage: number,
    response: any,
    ts?: string
  ): string {
    let oldest: string;

    if (currentPage === 1) {
      if (ts && ts !== '') {
        oldest = ts;
      } else {
        // 現在の指定年前の日付をUNIXタイムスタンプに変換
        const currentDate = new Date();
        currentDate.setDate(
          currentDate.getDate() - SlackApiClient.OLDEST_MESSAGE_DAY
        );
        oldest = (currentDate.valueOf() / 1000).toString();
      }
    } else {
      oldest = response.messages[0].ts;
    }

    return oldest;
  }

  /**
   * リプライのoldestを作成する
   *
   * @param currentPage 現在ページ
   * @param response レスポンス
   * @param parentTs 親スレッドのタイムスタンプ
   * @returns リプライのoldest
   */
  private createRepliesOldest(
    currentPage: number,
    response: any,
    parentTs: string
  ): string {
    let oldest: string;

    if (currentPage === 1) {
      oldest = parentTs;
    } else {
      oldest = response.messages[response.messages.length - 1].ts;
    }

    return oldest;
  }

  /**
   * メッセージ一覧取得時のオプションを作成する
   *
   * @param channelId チャンネルID
   * @param oldest タイムスタンプ
   * @returns メッセージ一覧取得時のオプション
   */
  private createMessagesOptions(channelId: string, oldest: string): any {
    return {
      channel: channelId,
      limit: SlackApiClient.LIMIT_PER_REQUEST,
      oldest,
    };
  }

  /**
   * リプライ一覧取得時のオプションを作成する
   *
   * @param channelId チャンネルID
   * @param parentTs 親スレッドのタイムスタンプ
   * @param oldest oldest
   * @returns リプライ一覧取得時のオプション
   */
  private createRepliesOptions(
    channelId: string,
    parentTs: string,
    oldest: string
  ): any {
    return {
      channel: channelId,
      ts: parentTs,
      limit: SlackApiClient.LIMIT_PER_REQUEST,
      oldest,
    };
  }

  /**
   * Slack API を呼びデータを取得する
   *
   * @param slackApiType SlackApiType
   * @param params オプションパラメータ
   * @returns Slack API レスポンス
   */
  private getSlackApiData(slackApiType: SlackApiType, params: any = {}): any {
    const url = this.createUrl(slackApiType, params);

    const options = {
      headers: {
        Authorization: 'Bearer ' + this.getProperty(PropertyType.SlackApiToken),
      },
    };

    // eslint-disable-next-line no-undef
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (data.error) {
      throw new Error(
        `Slack API の呼び出しに失敗しました。 error: ${data.error}`
      );
    }

    return data;
  }

  /**
   * リクエスト URL を作成する
   *
   * @param slackApiType SlackApiType
   * @param params オプションパラメータ
   * @returns リクエスト URL
   */
  private createUrl(slackApiType: SlackApiType, params: any): string {
    const url = SlackApiClient.SLACK_API_URL + slackApiType;

    const querys = [];
    if (params) {
      for (const key in params) {
        querys.push(
          encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        );
      }
    }

    let query = '';
    if (querys.length !== 0) {
      query = '?' + querys.join('&');
    }

    return url + query;
  }

  /**
   * スクリプトプロパティを取得する
   *
   * @param propertyType PropertyType
   * @returns スクリプトプロパティ
   */
  private getProperty(propertyType: PropertyType): string {
    return this.propertyUtil.getProperty(propertyType);
  }
}
