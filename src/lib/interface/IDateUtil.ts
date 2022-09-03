export interface IDateUtil {
  createDateTimeString(ts: string): string;
  createCurrentDateString(ts: string): string;
  paddingZero(num: number, paddingLength: number): string;
}
