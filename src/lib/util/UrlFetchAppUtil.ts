/* eslint-disable no-undef */
import { GoogleDrive } from './GoogleDrive';
import { injectable, inject } from 'inversify';
import Types from '../types/types';

@injectable()
export class UrlFetchAppUtil {
  private googleDrive: GoogleDrive;

  public constructor(@inject(Types.GoogleDrive) googleDrive: GoogleDrive) {
    this.googleDrive = googleDrive;
  }

  /**
   * URLからコンテンツを取得する
   *
   * @param url URL
   * @param options オプション
   * @returns コンテンツ
   */
  public getContent(url: string, options: any): any {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (data.error) {
      throw new Error(`URLの呼び出しに失敗しました。 error: ${data.error}`);
    }

    return data;
  }

  /**
   * URLのファイルを保存する
   *
   * @param url URL
   * @param options オプション
   * @param folderId フォルダID
   * @param fileName ファイル名
   */
  public downloadFile(
    url: string,
    options: any,
    folderId: string,
    fileName: string
  ): void {
    // ファイル取得
    const response = UrlFetchApp.fetch(url, options);

    // 既にファイルが存在していたら削除
    if (this.googleDrive.existFile(folderId, fileName)) {
      this.googleDrive.removeFile(folderId, fileName);
    }

    // ファイルを保存
    const blob = response.getBlob().setName(fileName);
    const folder = this.googleDrive.getFolder(folderId);
    folder.createFile(blob);
  }
}
