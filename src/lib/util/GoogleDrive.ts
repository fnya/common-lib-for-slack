/* eslint-disable no-undef */
import { injectable } from 'inversify';
import { IGoogleDrive } from '../interface/IGoogleDrive';

@injectable()
export class GoogleDrive implements IGoogleDrive {
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
   * 指定したフォルダIDの配下にフォルダIDを取得する
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
      `作成しようとしたフォルダは存在しません。${folder.getName()} フォルダ:${folderName}`
    );
  }

  /**
   * 指定したフォルダIDの配下にフォルダ名が存在するか
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
        `作成しようとしたフォルダは既に存在しています。${folder.getName()} フォルダ:${folderName}`
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
  private getFolder(folderId: string): GoogleAppsScript.Drive.Folder {
    return DriveApp.getFolderById(folderId);
  }
}
