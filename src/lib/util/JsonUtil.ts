/* eslint-disable no-undef */
import { GoogleDrive } from './GoogleDrive';
import { inject, injectable } from 'inversify';
import Types from '../types/Types';

@injectable()
export class JsonUtil {
  private googleDrive: GoogleDrive;

  constructor(@inject(Types.GoogleDrive) googleDrive: GoogleDrive) {
    this.googleDrive = googleDrive;
  }

  /**
   * JSON 存在チェック
   *
   * @param folderId フォルダID
   * @param name JSON名(.jsonなし)
   * @returns true:存在する/false:存在しない
   */
  public exists(folderId: string, name: string): boolean {
    const folder = this.googleDrive.getFolder(folderId);
    const it = folder.getFilesByName(name);

    if (it.hasNext()) {
      // 既に存在していた場合
      return true;
    }

    return false;
  }

  /**
   * JSON をロードする
   *
   * @param folderId フォルダID
   * @param name JSON名(.jsonなし)
   * @returns json
   */
  public load(folderId: string, name: string): string {
    const folder = this.googleDrive.getFolder(folderId);
    const it = folder.getFilesByName(name);

    if (it.hasNext()) {
      // 既に存在していた場合
      const file = it.next();
      return file.getBlob().getDataAsString('utf8');
    }

    throw new Error(
      `指定したJSONは存在しません。フォルダID:${folderId}, JSON:${name}`
    );
  }

  /**
   * JSON を保存する
   *
   * @param folderId フォルダID
   * @param name JSON名(.jsonなし)
   * @param json json
   * @param override json保存時に上書きするか(デフォルトtreue)
   */
  public save(
    folderId: string,
    name: string,
    json: string,
    override: boolean = true
  ): void {
    if (this.exists(folderId, name)) {
      if (override) {
        this.remove(folderId, name);
      } else {
        throw new Error(
          `指定したJSONが存在します。フォルダID:${folderId}, JSON:${name}`
        );
      }
    }

    // コンテンツタイプ
    const contentType = 'application/json';
    // 文字コード
    const charset = 'UTF-8';
    // 出力するフォルダ
    const folder = this.googleDrive.getFolder(folderId);
    // Blob を作成する
    const blob = Utilities.newBlob('', contentType, name).setDataFromString(
      json,
      charset
    );
    // ファイルに保存
    folder.createFile(blob);
  }

  /**
   * JSON 削除
   *
   * @param folderId フォルダID
   * @param name JSON名(.jsonなし)
   */
  public remove(folderId: string, name: string): void {
    if (!this.exists(folderId, name)) {
      throw new Error(
        `指定したJSONが存在しません。フォルダID:${folderId}, JSON:${name}`
      );
    }

    const folder = this.googleDrive.getFolder(folderId);
    const file = folder.getFilesByName(name).next();
    folder.removeFile(file);
  }
}
