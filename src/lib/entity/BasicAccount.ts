export class BasicAccount {
  /** 基本認証 ID */
  public id: string;

  /** 基本認証 パスワード	 */
  public password: string;

  /**
   * BasicAccount のコンストラクタ
   *
   * @param id 基本認証 ID
   * @param password 基本認証 パスワード
   */
  public constructor(id: string, password: string) {
    this.id = id;
    this.password = password;
  }
}
