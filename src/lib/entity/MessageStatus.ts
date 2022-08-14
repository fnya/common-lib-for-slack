export class MessageStatus {
  /** チャンネル ID  */
  public channelId: string;

  /** 最終更新日時(yyyy-MM-dd HH:mm:ss) */
  public updated: string;

  /**
   * MessageStatus のコンストラクタ
   *
   * @param channelId チャンネル ID
   * @param updated 最終更新日時(yyyy-MM-dd HH:mm:ss)
   */
  public constructor(channelId: string, updated: string) {
    this.channelId = channelId;
    this.updated = updated;
  }
}
