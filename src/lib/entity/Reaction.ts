export class Reaction {
  /** リアクション名 */
  public name: string;

  /** リアクション数 */
  public count: number;

  /**
   * Reaction のコンストラクタ
   *
   * @param name リアクション名
   * @param count リアクション数
   */
  public constructor(name: string, count: number) {
    this.name = name;
    this.count = count;
  }
}
