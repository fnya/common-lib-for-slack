import { injectable } from 'inversify';

@injectable()
export class DateUtil {
  /**
   * tsから日時文字列を作成する
   *
   * @param ts ts
   * @returns 日時文字列
   */
  public createDateTimeString(ts: string): string {
    if (!ts) {
      return '';
    }

    const date = new Date(Number(ts) * 1000);
    return (
      date.getFullYear() +
      '-' +
      this.paddingZero(date.getMonth() + 1, 2) +
      '-' +
      this.paddingZero(date.getDate(), 2) +
      ' ' +
      this.paddingZero(date.getHours(), 2) +
      ':' +
      this.paddingZero(date.getMinutes(), 2) +
      ':' +
      this.paddingZero(date.getSeconds(), 2)
    );
  }

  /**
   * tsから年月日の数値を作成する
   *
   * @param ts ts
   * @returns 年月日の数値
   */
  public createDateNumber(ts: string): number {
    if (!ts) {
      return 0;
    }

    const date = new Date(Number(ts) * 1000);

    const dateNumber = Number(
      date.getFullYear() +
        this.paddingZero(date.getMonth() + 1, 2) +
        this.paddingZero(date.getDate(), 2)
    );

    return dateNumber;
  }

  /**
   * 現在日文字列を取得する
   *
   * @returns 現在日文字列(yyyyMMdd)
   */
  public getCurrentDateString(): string {
    const date = new Date();
    return (
      date.getFullYear() +
      this.paddingZero(date.getMonth() + 1, 2) +
      this.paddingZero(date.getDate(), 2)
    );
  }

  /**
   * 現在年月日の数値を取得する
   *
   * @returns 現在年月日の数値
   */
  public getCurrentDateNumber(): Number {
    const date = new Date();
    return Number(
      date.getFullYear() +
        this.paddingZero(date.getMonth() + 1, 2) +
        this.paddingZero(date.getDate(), 2)
    );
  }

  /**
   * 数値を前ゼロを付与する
   *
   * @param num 数値
   * @param paddingLength 前ゼロ桁数
   * @returns 前ゼロ付き数値(文字列)
   */
  public paddingZero(num: number, paddingLength: number): string {
    return ('0'.repeat(paddingLength) + num.toString()).slice(
      paddingLength * -1
    );
  }

  /**
   * 現在のTSを取得する
   *
   * @returns 現在のTS
   */
  public getCurrentTs(): string {
    // 現在の指定年前の日付をUNIXタイムスタンプに変換
    const currentDate = new Date();

    return (currentDate.valueOf() / 1000).toString();
  }

  /**
   * 90日前のTSを取得する
   *
   * @returns 90日前のTS
   */
  public getTsBefore90Days(): string {
    // 現在の指定年前の日付をUNIXタイムスタンプに変換
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 90);

    return (currentDate.valueOf() / 1000).toString();
  }
}
