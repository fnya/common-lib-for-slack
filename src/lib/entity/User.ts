export class User {
  /** 11 桁の Slack user id */
  public id: string;

  /** 表示名(json, 暗号化) */
  public name: string;

  /** アバター画像 URL(null あり) */
  public imageUrl?: string;

  /** 削除済み */
  public deleted: boolean;

  /**
   * User のコンストラクタ
   *
   * @param id 11 桁の Slack user id
   * @param name 表示名(json, 暗号化)
   * @param deleted 削除済み
   * @param imageUrl アバター画像 URL(null あり)
   */
  public constructor(
    id: string,
    name: string,
    deleted: boolean,
    imageUrl?: string
  ) {
    this.id = id;
    this.name = name;
    this.deleted = deleted;
    this.imageUrl = imageUrl;
  }
}
