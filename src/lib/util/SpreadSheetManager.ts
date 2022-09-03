/* eslint-disable no-undef */
import { inject, injectable } from 'inversify';
import { IGoogleDrive } from '../interface/IGoogleDrive';
import Types from '../types/Types';

@injectable()
export class SpreadSheetManager {
  private iGoogleDrive: IGoogleDrive;

  public constructor(@inject(Types.IGoogleDrive) iGoogleDrive: IGoogleDrive) {
    this.iGoogleDrive = iGoogleDrive;
  }

  /**
   * スプレッドシート存在チェック
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @returns true:存在する/false:存在しない
   */
  public exists(folderId: string, sheetName: string): boolean {
    const folder = this.iGoogleDrive.getFolder(folderId);
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
    const folder = this.iGoogleDrive.getFolder(folderId);
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

    return activeSheet.getRange(1, 1, maxRow, maxColumn).getValues();
  }

  /**
   * arraysをスプレッドシートに上書き保存する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @param arrays 2次元配列
   */
  public save(folderId: string, sheetName: string, arrays: string[][]): void {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();

    if (arrays.length > 0) {
      // delete/insert
      activeSheet.clearContents();
      activeSheet
        .getRange(1, 1, arrays.length, arrays[0].length)
        .setNumberFormat('@')
        .setValues(arrays);
    }
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
    const folder = this.iGoogleDrive.getFolder(folderId);
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
}
