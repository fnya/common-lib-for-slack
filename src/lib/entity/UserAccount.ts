export class UserAccount {
  /** メールアドレス */
  public email: string;

  /** 権限のあるプライベートチャンネルのリスト(null あり) */
  public channels?: string[];

  /** パスワード(ハッシュ化, null あり) */
  public password?: string;

  /** ソルト(null あり) */
  public salt?: string;

  /** リフレッシュトークン(null あり) */
  public refreshToken?: string;

  /** リフレッシュトークン有効期限(ts, null あり) */
  public expiryDateTs?: string;

  /** リフレッシュトークン有効期限(yyyy-MM-dd HH:mm:ss, null あり) */
  public expiryDate?: string;

  /**
   * UserAccount のコンストラクタ
   *
   * @param email メールアドレス
   * @param channels 権限のあるプライベートチャンネルのリスト(null あり)
   * @param password パスワード(ハッシュ化, null あり)
   * @param salt ソルト(null あり)
   * @param refreshToken リフレッシュトークン(null あり)
   * @param expiryDateTs リフレッシュトークン有効期限(ts, null あり)
   * @param expiryDate リフレッシュトークン有効期限(yyyy-MM-dd HH:mm:ss, null あり)
   */
  public constructor(
    email: string,
    channels?: string[],
    password?: string,
    salt?: string,
    refreshToken?: string,
    expiryDateTs?: string,
    expiryDate?: string
  ) {
    this.email = email;
    this.channels = channels;
    this.password = password;
    this.salt = salt;
    this.refreshToken = refreshToken;
    this.expiryDateTs = expiryDateTs;
    this.expiryDate = expiryDate;
  }
}
