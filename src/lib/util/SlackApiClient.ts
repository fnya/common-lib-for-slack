import { inject, injectable } from 'inversify';
import { ISlackApiClient } from '../interface/ISlackApiClient';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import Types from '../types/Types';
import PropertyType from '../types/PropertyType';
import { SlackApiType } from '../types/SlackApiType';

@injectable()
export class SlackApiClient implements ISlackApiClient {
  private static SLACK_API_URL = 'https://slack.com/api/';
  private static MAX_PAGINATION = 2; // 10;
  private static LIMIT_PER_REQUEST = 3; // 000;
  private iPropertyUtil: IPropertyUtil;

  public constructor(
    @inject(Types.IPropertyUtil) iPropertyUtil: IPropertyUtil
  ) {
    this.iPropertyUtil = iPropertyUtil;
  }

  /**
   * チャンネル一覧を取得する
   *
   * @returns チャンネル一覧
   */
  public getChannels(): any {
    const options = { types: 'public_channel,private_channel' };
    return this.getSlackApiData(SlackApiType.Channels, options);
  }

  /**
   * メンバー一覧を取得する
   *
   * @returns メンバー一覧
   */
  public getMembers(): any {
    return this.getSlackApiData(SlackApiType.Members);
  }

  /**
   * チャンネルごとのメッセージ一覧を取得する
   *
   * @param channelId チャンネルID
   * @param oldest 最も古いタイムスタンプ
   * @returns チャンネルごとのメッセージ一覧
   */
  public getMessages(channelId: string, oldest: string = '0'): any {
    // TODO: 共有した場合の内容取得が未定
    // TODO: 一番古いのを取りたいのに最新を取ってしまう
    let messages: any[] = [];
    let currentPage = 1;
    let response: any = {};

    while (
      (!('has_more' in response) || response.has_more) &&
      currentPage <= SlackApiClient.MAX_PAGINATION
    ) {
      let latestOldest = oldest;
      if (currentPage !== 1) {
        // 先頭ページ以外はメッセージが重複するため先頭を除外
        // response.messages.shift();
        latestOldest = response.messages[0].ts;
      }

      // Slack API 呼び出し
      response = this.getSlackApiData(
        SlackApiType.Messages,
        this.createMessagesOptions(channelId, latestOldest)
      );

      messages = messages.concat(response.messages);

      console.log(`currentPage = ${currentPage}`);
      console.log(`has more = ${response.has_more}`);

      for (const m of messages) {
        console.log(m.text);
      }

      currentPage++;
    }

    return messages;
  }

  private createMessagesOptions(channelId: string, oldest: string): any {
    return {
      channel: channelId,
      limit: SlackApiClient.LIMIT_PER_REQUEST,
      inclusive: true,
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

    console.log(url);

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
    return this.iPropertyUtil.getProperty(propertyType);
  }
}
