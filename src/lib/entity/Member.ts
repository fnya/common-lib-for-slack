export class Member {
  /** 11 桁の Slack user id */
  public id: string;

  /** 名前 */
  public name: string;

  /** 表示名 */
  public displayName: string;

  /** アバター画像 URL(null あり) */
  public imageUrl?: string;

  /** 削除済み */
  public deleted: boolean;

  /**
   *  Member のコンストラクタ
   *
   * @param id 11 桁の Slack user id
   * @param name 名前
   * @param displayName 表示名
   * @param deleted 削除済み
   * @param imageUrl アバター画像 URL(null あり)
   */
  public constructor(
    id: string,
    name: string,
    displayName: string,
    deleted: boolean,
    imageUrl?: string
  ) {
    this.id = id;
    this.name = name;
    this.displayName = displayName;
    this.deleted = deleted;
    this.imageUrl = imageUrl;
  }
}
