export class File {
  /** 11 桁の Slack file id */
  public id: string;

  /** created を変換した日時(yyyy-MM-dd hh:mm:ss) */
  public created: string;

  /** ファイル名 */
  public name: string;

  /** MIME タイプ(ex. image/png) */
  public mimeType: string;

  /** ファイル形式(ex. png) */
  public fileType: string;

  /** ファイルダウンロードURL */
  public downloadUrl: string;

  /** Google Drive のファイル ID */
  public fileId: string;

  /**
   * File のコンストラクタ
   *
   * @param id 1 桁の Slack file id
   * @param created created を変換した日時(yyyy-MM-dd hh:mm:ss)
   * @param name ファイル名
   * @param mimeType MIME タイプ(ex. image/png)
   * @param fileType ファイル形式(ex. png)
   *
   * @param fileId Google Drive のファイル ID
   */
  public constructor(
    id: string,
    created: string,
    name: string,
    mimeType: string,
    fileType: string,
    downloadUrl: string,
    fileId: string
  ) {
    this.id = id;
    this.created = created;
    this.name = name;
    this.mimeType = mimeType;
    this.fileType = fileType;
    this.downloadUrl = downloadUrl;
    this.fileId = fileId;
  }
}
