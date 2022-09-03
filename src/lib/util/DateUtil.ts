/* eslint-disable no-undef */
import { injectable } from 'inversify';
import { IDateUtil } from '../interface/IDateUtil';

@injectable()
export class DateUtil implements IDateUtil {
  /**
   * tsから日時文字列を作成する
   *
   * @param ts ts
   * @returns 日時文字列
   */
  public createDateTimeString(ts: string): string {
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
   * 現在日文字列を作成する
   *
   * @returns 現在日文字列(yyyyMMdd)
   */
  public createCurrentDateString(ts: string): string {
    const date = new Date();
    return (
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
}
