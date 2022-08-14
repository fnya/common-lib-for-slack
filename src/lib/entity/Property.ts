export class Property {
  /** バージョン */
  public version: number;

  /** 内容 */
  public value: string;

  /**
   * Property のコンストラクタ
   *
   * @param version バージョン
   * @param value 内容
   */
  public constructor(version: number, value: string) {
    this.version = version;
    this.value = value;
  }
}
