export class ReplyStatus {
  /** チャンネル ID */
  public channelId: string;

  /** 最終更新日時(yyyy-MM-dd HH:mm:ss) */
  public updated: string;

  /**
   * ReplyStatus のコンストラクタ
   *
   * @param channelId チャンネル ID
   * @param updated 最終更新日時(yyyy-MM-dd HH:mm:ss)
   */
  public constructor(channelId: string, updated: string) {
    this.channelId = channelId;
    this.updated = updated;
  }
}
