export class Channel {
  /** 11 桁の Slack channel id */
  public id: string;

  /** 表示名 */
  public name: string;

  /** プライベートチャンネルか */
  public isPrivate: boolean;

  /** topic の value (説明)  */
  public topic: string;

  /** purpose の value (目的)  */
  public purpose: string;

  /**
   * Channel のコンストラクタ
   *
   * @param id 11 桁の Slack channel id
   * @param name 表示名
   * @param isPrivate プライベートチャンネルか
   * @param topic topic の value (説明)
   * @param purpose purpose の value (目的)
   */
  public constructor(
    id: string,
    name: string,
    isPrivate: boolean,
    topic: string,
    purpose: string
  ) {
    this.id = id;
    this.name = name;
    this.isPrivate = isPrivate;
    this.topic = topic;
    this.purpose = purpose;
  }
}
