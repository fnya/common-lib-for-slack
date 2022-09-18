export class MessageStatus {
  /** チャンネル ID  */
  public channelId: string;

  /** 最終更新ts */
  public ts: string;

  /** 最終更新日時(yyyy-MM-dd HH:mm:ss) */
  public updated: string;

  /**
   * MessageStatus のコンストラクタ
   *
   * @param channelId チャンネル ID
   * @param ts 最終更新ts
   * @param updated 最終更新日時(yyyy-MM-dd HH:mm:ss)
   */
  public constructor(channelId: string, ts: string, updated: string) {
    this.channelId = channelId;
    this.ts = ts;
    this.updated = updated;
  }
}
