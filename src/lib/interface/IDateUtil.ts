export interface IDateUtil {
  createDateTimeString(ts: string): string;
  createDateNumber(ts: string): number;
  getCurrentDateString(): string;
  getCurrentDateNumber(): Number;
  paddingZero(num: number, paddingLength: number): string;
  getCurrentTs(): string;
  getTsBefore90Days(): string;
}
