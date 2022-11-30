export class PasswordProperty {
  /** 認証アルゴリズムバージョン */
  public authAlgorithmVersion: number;

  /** 認証データバージョン */
  public authDataVersion: number;

  /** 内容 */
  public value: string;

  /**
   * PasswordProperty のコンストラクタ
   *
   * @param authAlgorithmVersion 認証アルゴリズムバージョン
   * @param authDataVersion 認証データバージョン
   * @param value 内容
   */
  public constructor(
    authAlgorithmVersion: number,
    authDataVersion: number,
    value: string
  ) {
    this.authAlgorithmVersion = authAlgorithmVersion;
    this.authDataVersion = authDataVersion;
    this.value = value;
  }
}
