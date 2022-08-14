import { Reaction } from './Reaction';
import { File } from './File';
import { Url } from './Url';

export class Reply {
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

  /** 親スレッドのタイムスタンプ */
  public treadTs: string;

  /** リアクションのリスト(null あり) */
  public reactions?: Reaction[];

  /** 添付ファイルのリスト(null あり) */
  public files?: File[];

  /** url のリスト(null あり)  */
  public urls?: Url[];

  /**
   * Reply のコンストラクタ
   *
   * @param ts メッセージのタイムスタンプ
   * @param created ts を変換した日時(yyyy-MM-dd HH:mm:ss)
   * @param userId 11 桁の Slack user id
   * @param userName user name (暗号化)
   * @param text メッセージ(暗号化,json)
   * @param treadTs 親スレッドのタイムスタンプ
   * @param reactions リアクションのリスト(null あり)
   * @param files 添付ファイルのリスト(null あり)
   * @param urls url のリスト(null あり)
   */
  public constructor(
    ts: string,
    created: string,
    userId: string,
    userName: string,
    text: string,
    treadTs: string,
    reactions?: Reaction[],
    files?: File[],
    urls?: Url[]
  ) {
    this.ts = ts;
    this.created = created;
    this.userId = userId;
    this.userName = userName;
    this.text = text;
    this.treadTs = treadTs;
    this.reactions = reactions;
    this.files = files;
    this.urls = urls;
  }
}
