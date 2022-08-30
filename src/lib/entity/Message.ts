export class Message {
  /** メッセージのタイムスタンプ  */
  public ts: string;

  /** ts を変換した日時(yyyy-MM-dd HH:mm:ss) */
  public created: string;

  /** 11 桁の Slack user id  */
  public userId: string;

  /** user name (暗号化) */
  public userName: string;

  /** メッセージ(暗号化,json) */
  public text: string;

  /** リプライカウント */
  public replyCount: number;

  /** json */
  public json: string;

  /** リアクションのリスト */
  public reactions: string;

  /** 添付ファイルのリスト */
  public files: string;

  /** url のリスト */
  public urls: string;

  /**
   * Message のコンストラクタ
   *
   * @param ts メッセージのタイムスタンプ
   * @param created ts を変換した日時(yyyy-MM-dd HH:mm:ss)
   * @param userId 11 桁の Slack user id
   * @param userName user name (暗号化)
   * @param text メッセージ(暗号化,json)
   * @param replyCount リプライカウント
   * @param json json
   * @param reactions リアクションのリスト
   * @param files 添付ファイルのリスト
   * @param urls url のリスト
   */
  public constructor(
    ts: string,
    created: string,
    userId: string,
    userName: string,
    text: string,
    replyCount: number,
    json: string,
    reactions: string,
    files: string,
    urls: string
  ) {
    this.ts = ts;
    this.created = created;
    this.userId = userId;
    this.userName = userName;
    this.text = text;
    this.replyCount = replyCount;
    this.json = json;
    this.reactions = reactions;
    this.files = files;
    this.urls = urls;
  }
}
