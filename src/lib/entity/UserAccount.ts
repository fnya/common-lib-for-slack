export class UserAccount {
  /** メールアドレス */
  public email: string;

  /** 権限のあるプライベートチャンネルのリスト(null あり) */
  public channels?: string[];

  /** パスワード(ハッシュ化, null あり) */
  public password?: string;

  /** ソルト(null あり) */
  public salt?: string;

  /** ユーザー認証後に作成されるトークン(null あり) */
  public token?: string;

  /** トークンの有効期間(yyyy-MM-dd HH:mm:ss, null あり) */
  public tokenExpiration?: string;

  /**
   * UserAccount のコンストラクタ
   *
   * @param email メールアドレス
   * @param channels 権限のあるプライベートチャンネルのリスト(null あり)
   * @param password パスワード(ハッシュ化, null あり)
   * @param salt ソルト(null あり)
   * @param token ユーザー認証後に作成されるトークン(null あり)
   * @param tokenExpiration トークンの有効期間(yyyy-MM-dd HH:mm:ss, null あり)
   */
  public constructor(
    email: string,
    channels?: string[],
    password?: string,
    salt?: string,
    token?: string,
    tokenExpiration?: string
  ) {
    this.email = email;
    this.channels = channels;
    this.password = password;
    this.salt = salt;
    this.token = token;
    this.tokenExpiration = tokenExpiration;
  }
}
