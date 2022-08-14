export class Log {
  /** 出力日時（yyyy-MM-dd HH:mm:ss） */
  public dateTime: string;

  /** 内容 */
  public content: string;

  /**
   * Log のコンストラクタ
   *
   * @param dateTime 出力日時（yyyy-MM-dd HH:mm:ss）
   * @param content 内容
   */
  public constructor(dateTime: string, content: string) {
    this.dateTime = dateTime;
    this.content = content;
  }
}
