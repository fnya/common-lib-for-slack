/* eslint-disable no-undef */
import { injectable } from 'inversify';

@injectable()
export class GoogleDrive {
  /**
   * 指定したフォルダIDの配下にフォルダ名が存在するか
   *
   * @param folderId フォルダID
   * @param folderName フォルダ名
   * @returns true: 存在する/false: 存在しない
   */
  public existFolder(folderId: string, folderName: string): boolean {
    const folder = this.getFolder(folderId);
    const it = folder.getFoldersByName(folderName);

    if (it.hasNext()) {
      // 既に存在していた場合
      return true;
    }

    return false;
  }

  /**
   * 指定したフォルダID配下のフォルダIDを取得する
   *
   * @param folderId フォルダID
   * @param folderName フォルダ名
   * @returns 指定したフォルダID
   */
  public getFolderId(folderId: string, folderName: string): string {
    const folder = this.getFolder(folderId);
    const it = folder.getFoldersByName(folderName);

    if (it.hasNext()) {
      // 既に存在していた場合
      return it.next().getId();
    }
    throw new Error(
      `指定したフォルダは存在しません。 フォルダID:${folderId} フォルダ名:${folderName}`
    );
  }

  /**
   * 指定したフォルダIDの配下にフォルダを作成する
   *
   * @param folderId フォルダID
   * @param folderName フォルダ名
   * @returns 作成したフォルダID
   */
  public createFolder(folderId: string, folderName: string): string {
    const folder = this.getFolder(folderId);
    const it = folder.getFoldersByName(folderName);

    if (it.hasNext()) {
      // 既に存在していた場合
      throw new Error(
        `作成しようとしたフォルダは既に存在しています。 フォルダID:${folderId} フォルダ名:${folderName}`
      );
    }

    return folder.createFolder(folderName).getId();
  }

  /**
   * 指定したフォルダが存在しなければ作成してフォルダIDを返し、存在していればそのフォルダIDを返す
   *
   * @param folderId フォルダID
   * @param folderName フォルダ名
   * @returns フォルダID
   */
  public createFolderOrGetFolderId(
    folderId: string,
    folderName: string
  ): string {
    if (this.existFolder(folderId, folderName)) {
      return this.getFolderId(folderId, folderName);
    }

    return this.createFolder(folderId, folderName);
  }

  /**
   * フォルダIDからフォルダを取得する
   *
   * @param folderId フォルダID
   * @returns フォルダ
   */
  public getFolder(folderId: string): GoogleAppsScript.Drive.Folder {
    return DriveApp.getFolderById(folderId);
  }

  /**
   * ファイルをバックアップする
   *
   * @param folderId フォルダID
   * @param fileName ファイル名
   */
  public backupFile(folderId: string, fileName: string): void {
    const folder = this.getFolder(folderId);
    const it = folder.getFilesByName(fileName);

    if (!it.hasNext()) {
      throw new Error(
        `指定したファイルは存在しません。 フォルダID:${folderId} ファイル名名:${fileName}`
      );
    }

    const file = it.next();
    const backupFileName = fileName + '_bk';

    // 既にバックアップファイルがある場合は削除する
    const itbk = folder.getFilesByName(backupFileName);
    if (itbk.hasNext()) {
      const backupFile = itbk.next();
      folder.removeFile(backupFile);
    }

    file.makeCopy(backupFileName, folder);
  }

  /**
   * ルートフォルダの配下にフォルダ名が存在するか
   *
   * @param folderName フォルダ名
   * @returns true: 存在する/false: 存在しない
   */
  public existFolderInRoot(folderName: string): boolean {
    const it = DriveApp.getFoldersByName(folderName);

    if (it.hasNext()) {
      // 既に存在していた場合
      return true;
    }

    return false;
  }

  /**
   * ルート配下のフォルダIDを取得する
   *
   * @param folderName フォルダ名
   * @returns フォルダID
   */
  public getFolderIdInRoot(folderName: string): string {
    const it = DriveApp.getFoldersByName(folderName);

    if (it.hasNext()) {
      // 既に存在していた場合
      return it.next().getId();
    }

    throw new Error(
      `指定したフォルダはルートに存在しません。 フォルダ名:${folderName}`
    );
  }

  /**
   * ルートフォルダの配下にフォルダを作成する
   *
   * @param folderName フォルダ名
   * @returns 作成したフォルダID
   */
  public createFolderInRoot(folderName: string): string {
    if (this.existFolderInRoot(folderName)) {
      // 既に存在していた場合
      throw new Error(
        `作成しようとしたフォルダは既にルートに存在しています。 フォルダ名:${folderName}`
      );
    }

    return DriveApp.createFolder(folderName).getId();
  }
}
