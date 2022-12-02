/* eslint-disable no-undef */
import { GoogleDrive } from './GoogleDrive';
import { inject, injectable } from 'inversify';
import { SpreadSheetType } from '../types/SpreadSheetType';
import Types from '../types/Types';
import PropertyUtil from './PropertyUtil';
import PropertyType from '../types/PropertyType';

@injectable()
export class SpreadSheetManager {
  private googleDrive: GoogleDrive;
  private propertyUtl: PropertyUtil;

  public constructor(
    @inject(Types.GoogleDrive) googleDrive: GoogleDrive,
    @inject(Types.PropertyUtil) propertyUtl: PropertyUtil
  ) {
    this.googleDrive = googleDrive;
    this.propertyUtl = propertyUtl;
  }

  /**
   * スプレッドシート存在チェック
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @returns true:存在する/false:存在しない
   */
  public exists(folderId: string, sheetName: string): boolean {
    const folder = this.googleDrive.getFolder(folderId);
    const it = folder.getFilesByName(sheetName);

    if (it.hasNext()) {
      // 既に存在していた場合
      return true;
    }

    return false;
  }

  /**
   * スプレッドシートを作成
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   */
  public create(folderId: string, sheetName: string): void {
    const folder = this.googleDrive.getFolder(folderId);
    const it = folder.getFilesByName(sheetName);

    if (it.hasNext()) {
      // 既に存在していた場合
      throw new Error(
        `作成しようとしたスプレッドシートは既に存在しています。${folder.getName()} フォルダ:${sheetName}`
      );
    }

    const spreadSheet = SpreadsheetApp.create(sheetName);
    folder.addFile(DriveApp.getFileById(spreadSheet.getId()));
  }

  /**
   * 指定したスプレッドシートが存在しなければ作成する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   */
  public createIfDoesNotExist(folderId: string, sheetName: string): void {
    if (!this.exists(folderId, sheetName)) {
      this.create(folderId, sheetName);
    }
  }

  /**
   * スプレッドシートをロードする
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @returns 2次元配列
   */
  public load(folderId: string, sheetName: string): string[][] {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();
    const maxRow = activeSheet.getLastRow();
    const maxColumn = activeSheet.getLastColumn();

    // シートにデータがない場合は空配列を返す
    if (maxRow === 0 || maxColumn === 0) {
      return [];
    }

    // データの先頭が=の場合は'を先頭に追加しているので、'を除外するために
    // getValues() ではなく getDisplayValues() を使用している。
    return activeSheet.getRange(1, 1, maxRow, maxColumn).getDisplayValues();
  }

  /**
   * ユーザー一覧からユーザーIDを検索してユーザー情報を取得する
   *
   * @param userId ユーザーID
   * @returns ユーザー情報
   */
  public searchUser(userId: string): string[] {
    const adminFolderId = this.propertyUtl.getProperty(
      PropertyType.AdminFolerId
    );

    const spreadSheet = this.getSpreadSheet(
      adminFolderId,
      SpreadSheetType.UserAccounts
    );
    const activeSheet = spreadSheet.getActiveSheet();
    const targetRange = activeSheet.getRange(1, 1, activeSheet.getLastRow(), 1);
    const textFinder = targetRange
      .createTextFinder(userId)
      .matchCase(true) // 大文字小文字を区別する
      .matchEntireCell(true); // セル内全体一致

    // 検索実行
    const results = textFinder.findAll();

    // 検索結果が0件、または2件以上の場合は空配列を返す
    if (results.length !== 1) {
      return [];
    }

    return activeSheet
      .getRange(
        results[0].getRow(),
        1,
        results[0].getRow(),
        activeSheet.getLastColumn()
      )
      .getValues()[0];
  }

  /**
   * arraysをスプレッドシートに上書き保存する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @param arrays 2次元配列
   */
  public save(folderId: string, sheetName: string, arrays: string[][]): void {
    // スプレッドシートが存在しなければ作成する
    this.createIfDoesNotExist(folderId, sheetName);

    // アクティブシートを取得する
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();

    // 上書き保存する
    if (arrays.length > 0) {
      activeSheet.clearContents();
      activeSheet
        .getRange(1, 1, arrays.length, arrays[0].length)
        // 文字列形式にする
        .setNumberFormat('@')
        // 文字列形式にしても先頭に=が入っていると計算式と判断されるので、先頭が=の場合は'を追加する
        .setValues(this.addSingleQuoteToArrays(arrays));
    }
  }

  /**
   * スプレッドシートをarraysで更新する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @param arrays 2次元配列
   */
  public update(folderId: string, sheetName: string, arrays: string[][]): void {
    // スプレッドシートが存在しなければ作成する
    this.createIfDoesNotExist(folderId, sheetName);

    // アクティブシートを取得する
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();

    for (const array of arrays) {
      // 検索準備
      const maxRow =
        activeSheet.getMaxRows() > 0 ? activeSheet.getMaxRows() : 1;
      const textFinder = activeSheet
        .getRange(1, 1, maxRow, 1)
        .createTextFinder(array[0]);

      // 検索を実行
      const results = textFinder.findAll();

      if (results.length > 0) {
        // 見つかったら更新
        activeSheet
          .getRange(results[0].getRow(), 1, 1, array.length)
          // 文字列形式にする
          .setNumberFormat('@')
          // 文字列形式にしても先頭に=が入っていると計算式と判断されるので、先頭が=の場合は'を追加する
          .setValues(this.addSingleQuoteToArrays([array]));
      } else {
        // 見つからなかったら追加
        activeSheet
          .getRange(activeSheet.getLastRow() + 1, 1, 1, array.length)
          // 文字列形式にする
          .setNumberFormat('@')
          // 文字列形式にしても先頭に=が入っていると計算式と判断されるので、先頭が=の場合は'を追加する
          .setValues(this.addSingleQuoteToArrays([array]));
      }
    }
  }

  /**
   * 最新のTSを取得する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @returns 最新のTS
   */
  public getLatestTs(folderId: string, sheetName: string): string {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();
    const maxRow = activeSheet.getLastRow();

    if (maxRow < 1) {
      return '';
    }

    return activeSheet.getRange(maxRow, 1).getValue();
  }

  /**
   * 指定したスプレッドシートを取得する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @returns スプレッドシート
   */
  private getSpreadSheet(
    folderId: string,
    sheetName: string
  ): GoogleAppsScript.Spreadsheet.Spreadsheet {
    const folder = this.googleDrive.getFolder(folderId);
    const it = folder.getFilesByName(sheetName);

    if (it.hasNext()) {
      // 既に存在していた場合
      const file = it.next();
      return SpreadsheetApp.openById(file.getId());
    }

    throw new Error(
      `指定したスプレッドシートは存在しません。フォルダID:${folderId},スプレッドシート:${sheetName}`
    );
  }

  /**
   * 文字列の先頭が=の場合は'を先頭に追加する
   *
   * @param arrays 2次元配列
   * @returns 2次元配列
   */
  private addSingleQuoteToArrays(arrays: string[][]): string[][] {
    const myArrays: string[][] = [];

    for (const array of arrays) {
      const mySubArrays: string[] = [];

      for (const subArray of array) {
        if (subArray[0] === '=') {
          mySubArrays.push("'" + subArray);
        } else {
          mySubArrays.push(subArray);
        }
      }
      myArrays.push(mySubArrays);
    }

    return myArrays;
  }
}
