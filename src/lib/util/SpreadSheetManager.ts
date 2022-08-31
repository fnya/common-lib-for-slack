/* eslint-disable no-undef */
import { injectable } from 'inversify';

@injectable()
export class SpreadSheetManager {
  /**
   * スプレッドシート存在チェック
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @returns true:存在する/false:存在しない
   */
  public existsSpreadSheet(folderId: string, sheetName: string): boolean {
    const folder = this.getFolder(folderId);
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
  public createSpreadSheet(folderId: string, sheetName: string): void {
    const folder = this.getFolder(folderId);
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
  public createIfSpreadSheetDoesNotExist(
    folderId: string,
    sheetName: string
  ): void {
    if (!this.existsSpreadSheet(folderId, sheetName)) {
      this.createSpreadSheet(folderId, sheetName);
    }
  }

  /**
   * Channelsをスプレッドシートに保存する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @param channels チャンネルの2次元配列
   */
  public saveChannels(
    folderId: string,
    sheetName: string,
    channels: string[][]
  ): void {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();

    if (channels.length > 0) {
      // delete/insert
      activeSheet.clearContents();
      // activeSheet.clearFormats();

      // const range = activeSheet.getRange(
      //   1,
      //   1,
      //   activeSheet.getMaxRows(),
      //   activeSheet.getMaxColumns()
      // );

      // https://stackoverflow.com/questions/13758913/format-a-google-sheets-cell-in-plaintext-via-apps-script
      // range.setNumberFormat('@STRING@');
      // range.setNumberFormat('@');

      for (const channel of channels) {
        activeSheet.appendRow(channel);
      }
    }
  }

  /**
   * スプレッドシートをロードする
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @returns 2次元配列
   */
  public loadSpreadSheet(folderId: string, sheetName: string): string[][] {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();
    const maxRow = activeSheet.getLastRow();
    const maxColumn = activeSheet.getLastColumn();

    return activeSheet.getRange(1, 1, maxRow, maxColumn).getValues();
  }

  /**
   * Membersをスプレッドシートに保存する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @param members メンバーの2次元配列
   */
  public saveMembers(
    folderId: string,
    sheetName: string,
    members: string[][]
  ): void {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();

    if (members.length > 0) {
      // delete/insert
      for (const member of members) {
        activeSheet.appendRow(member);
      }
    }
  }

  /**
   * Messagesをスプレッドシートに保存する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @param messages メッセージの2次元配列
   */
  public saveMessages(
    folderId: string,
    sheetName: string,
    messages: string[][]
  ): void {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();

    if (messages.length > 0) {
      // delete/insert
      activeSheet.clearContents();
      for (const message of messages) {
        activeSheet.appendRow(message);
      }
    }
  }

  /**
   * Repliesをスプレッドシートに保存する
   *
   * @param folderId フォルダID
   * @param sheetName スプレッドシート名
   * @param replies メッセージの2次元配列
   */
  public saveReplies(
    folderId: string,
    sheetName: string,
    replies: string[][]
  ): void {
    const spreadSheet = this.getSpreadSheet(folderId, sheetName);
    const activeSheet = spreadSheet.getActiveSheet();

    if (replies.length > 0) {
      // delete/insert
      activeSheet.clearContents();
      for (const reply of replies) {
        activeSheet.appendRow(reply);
      }
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
    const folder = this.getFolder(folderId);
    const it = folder.getFilesByName(sheetName);

    if (it.hasNext()) {
      // 既に存在していた場合
      const file = it.next();
      return SpreadsheetApp.openById(file.getId());
    }

    throw new Error(
      `指定したスプレッドシートは存在しません。${folder.getName()}フォルダ:${sheetName}`
    );
  }

  /**
   * フォルダIDからフォルダを取得する
   *
   * @param folderId フォルダID
   * @returns フォルダ
   */
  private getFolder(folderId: string): GoogleAppsScript.Drive.Folder {
    return DriveApp.getFolderById(folderId);
  }
}
