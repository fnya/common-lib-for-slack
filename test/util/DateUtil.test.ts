import 'reflect-metadata';
import { DateUtil } from '../../src/lib/util/DateUtil';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('DateUtil のテスト', () => {
  let dateUtil: DateUtil;

  beforeEach(() => {
    dateUtil = new DateUtil();
  });

  afterEach(() => {
    // Dateのモックを元に戻す
    jest.useRealTimers();
  });

  describe('createDateTimeString のテスト', () => {
    test('tsが正しい日時形式に変換されること', () => {
      // 準備
      const ts = '1586271896.000200';
      const expected = '2020-04-08 00:04:56';

      // 実行
      const actual = dateUtil.createDateTimeString(ts);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('createDateNumber のテスト', () => {
    test('tsが正しい日付形式に変換されること', () => {
      // 準備
      const ts = '1586271896.000200';
      const expected = 20200408;

      // 実行
      const actual = dateUtil.createDateNumber(ts);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('getCurrentDateString のテスト', () => {
    test('正しい日付形式を取得できる', () => {
      // 準備
      const mockDate = new Date(2022, 10, 5, 1, 2, 3);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
      const expected = '20221105';

      // 実行
      const actual = dateUtil.getCurrentDateString();

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('getCurrentDateNumber のテスト', () => {
    test('正しい日付形式を取得できる', () => {
      // 準備
      const mockDate = new Date(2022, 10, 5, 1, 2, 3);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
      const expected = 20221105;

      // 実行
      const actual = dateUtil.getCurrentDateNumber();

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('paddingZero のテスト', () => {
    test('前ゼロが正しく設定される', () => {
      // 準備
      const expected = '00001';

      // 実行
      const actual = dateUtil.paddingZero(1, 5);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('getCurrentTs のテスト', () => {
    test('正しい日付形式を取得できる', () => {
      // 準備
      const mockDate = new Date(2022, 10, 5, 1, 2, 3, 1);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
      const expected = '1667577723.001';

      // 実行
      const actual = dateUtil.getCurrentTs();

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('getTsBefore90Days のテスト', () => {
    test('正しい日付形式を取得できる', () => {
      // 準備
      const mockDate = new Date(2022, 10, 5, 1, 2, 3, 1);

      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
      const expected = '1659801723.001';

      // 実行
      const actual = dateUtil.getTsBefore90Days();

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
