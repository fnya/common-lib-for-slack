export class Message {
  /** メッセージのタイムスタンプ  */
  public ts: string;

  /** ts を変換した日時(yyyy-MM-dd HH:mm:ss) */
  public created: string;

  /** 11 桁の Slack user id  */
  public userId: string;

  /** ユーザー名 */
  public userName: string;

  /** メッセージ */
  public text: string;

  /** リプライカウント */
  public replyCount: number;

  /** 最新リプライのタイムスタンプ (ts)	 */
  public latestReplyTs: string;

  /** latestReplyTs を変換した日時(yyyy-MM-dd HH:mm:ss) */
  public latestReply: string;

  /** リアクションのリスト */
  public reactions: string;

  /** 添付ファイルのリスト */
  public files: string;

  /** url のリスト */
  public urls: string;

  /** 編集したか */
  public isEdited: boolean;

  /** 編集したts */
  public editedTs: string;

  /** editedTs を変換した日時(yyyy-MM-dd HH:mm:ss) */
  public edited: string;

  /** json */
  public json: string;

  /**
   * Message のコンストラクタ
   *
   * @param ts メッセージのタイムスタンプ
   * @param created ts を変換した日時(yyyy-MM-dd HH:mm:ss)
   * @param userId 11 桁の Slack user id
   * @param userName ユーザー名
   * @param text メッセージ
   * @param replyCount リプライカウント
   * @param latestReplyTs 最新リプライのタイムスタンプ (ts)
   * @param latestReply latestReplyTs を変換した日時(yyyy-MM-dd HH:mm:ss)
   * @param reactions リアクションのリスト
   * @param files 添付ファイルのリスト
   * @param urls url のリスト
   * @param isEdited 編集したか
   * @param editedTs 編集したts
   * @param edited editedTs を変換した日時(yyyy-MM-dd HH:mm:ss)
   * @param json json
   */
  public constructor(
    ts: string,
    created: string,
    userId: string,
    userName: string,
    text: string,
    replyCount: number,
    latestReplyTs: string,
    latestReply: string,
    reactions: string,
    files: string,
    urls: string,
    isEdited: boolean,
    editedTs: string,
    edited: string,
    json: string
  ) {
    this.ts = ts;
    this.created = created;
    this.userId = userId;
    this.userName = userName;
    this.text = text;
    this.replyCount = replyCount;
    this.latestReplyTs = latestReplyTs;
    this.latestReply = latestReply;
    this.reactions = reactions;
    this.files = files;
    this.urls = urls;
    this.isEdited = isEdited;
    this.editedTs = editedTs;
    this.edited = edited;
    this.json = json;
  }
}
