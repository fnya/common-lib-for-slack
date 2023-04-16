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
   * 指定したフォルダIDの配下にファイル名が存在するか
   *
   * @param folderId フォルダID
   * @param fileName ファイル名
   * @returns true: 存在する/false: 存在しない
   */
  public existFile(folderId: string, fileName: string): boolean {
    const folder = this.getFolder(folderId);
    const it = folder.getFilesByName(fileName);

    if (it.hasNext()) {
      // 既に存在していた場合
      return true;
    }

    return false;
  }

  /**
   * Blobを取得し文字列に変換して返す
   *
   * @param folderId フォルダID
   * @param fileName ファイル名
   * @returns Blobの文字列
   */
  public getBlobAsString(folderId: string, fileName: string): string {
    // ファイルが存在しない場合はエラー
    if (!this.existFile(folderId, fileName)) {
      throw new Error(
        `指定したファイルは存在しません。フォルダID:${folderId}, ファイル名:${fileName}`
      );
    }

    const folder = this.getFolder(folderId);
    const it = folder.getFilesByName(fileName);
    const file = it.next();
    return file.getBlob().getDataAsString('utf8');
  }

  /**
   * 文字列をBlobとして保存する
   *
   * @param folderId フォルダID
   * @param fileName ファイル名
   * @param text 文字列
   * @param override 強制上書き(true:強制上書き(デフォルト)/false:既存在の場合エラー)
   */
  public savaBlobFromString(
    folderId: string,
    fileName: string,
    text: string,
    override: boolean = true
  ): void {
    if (this.existFile(folderId, fileName)) {
      if (override) {
        this.removeFile(folderId, fileName);
      } else {
        throw new Error(
          `指定したファイルが存在します。フォルダID:${folderId}, ファイル名${fileName}`
        );
      }
    }

    // コンテンツタイプ
    const contentType = 'application/json';
    // 文字コード
    const charset = 'UTF-8';
    // 出力するフォルダ
    const folder = this.getFolder(folderId);
    // Blob を作成する
    const blob = Utilities.newBlob('', contentType, fileName).setDataFromString(
      text,
      charset
    );
    // ファイルに保存
    folder.createFile(blob);
  }

  /**
   * 指定したファイルを削除する
   *
   * @param folderId フォルダID
   * @param fileName ファイル名
   */
  public removeFile(folderId: string, fileName: string): void {
    if (!this.existFile(folderId, fileName)) {
      throw new Error(
        `指定したファイルが存在しません。フォルダID:${folderId}, ファイル名:${fileName}`
      );
    }

    const folder = this.getFolder(folderId);
    const file = folder.getFilesByName(fileName).next();
    folder.removeFile(file);
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
   * ルートフォルダの配下にファイル名が存在するか
   *
   * @param fileName ファイル名
   * @returns true: 存在する/false: 存在しない
   */
  public existFileInRoot(fileName: string): boolean {
    const it = DriveApp.getFilesByName(fileName);

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
   * ルート配下のファイルを取得する
   *
   * @param fileName ファイル名
   * @returns ファイル
   */
  public getFileInRoot(fileName: string): GoogleAppsScript.Drive.File {
    const it = DriveApp.getFilesByName(fileName);

    if (it.hasNext()) {
      // 既に存在していた場合
      return it.next();
    }

    throw new Error(
      `指定したフォルダはルートに存在しません。 ファイル名:${fileName}`
    );
  }

  /**
   * Blobを取得して返す
   *
   * @param folderId フォルダID
   * @param fileName ファイル名
   * @returns Blob
   */
  public getBlob(fileName: string): Blob {
    // ファイルが存在しない場合はエラー
    if (!this.existFileInRoot(fileName)) {
      throw new Error(`指定したファイルは存在しません。ファイル名:${fileName}`);
    }

    const file = this.getFileInRoot(fileName);

    return file.getBlob() as unknown as Blob;
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

  /**
   * ルートにフォルダがあればフォルダIDを返し、なければ作成してフォルダIDを返す
   *
   * @param folderName フォルダ名
   */
  public createFolderOrGetFolderIdInRoot(folderName: string): string {
    if (this.existFolderInRoot(folderName)) {
      return this.getFolderIdInRoot(folderName);
    }

    return this.createFolderInRoot(folderName);
  }
}
