/* eslint-disable no-undef */
import { inject, injectable } from 'inversify';
import { IGoogleDrive } from '../interface/IGoogleDrive';
import Types from '../types/Types';
import { IJsonUtil } from '../interface/IJsonUtil';

@injectable()
export class JsonUtil implements IJsonUtil {
  private iGoogleDrive: IGoogleDrive;

  public constructor(@inject(Types.IGoogleDrive) iGoogleDrive: IGoogleDrive) {
    this.iGoogleDrive = iGoogleDrive;
  }

  /**
   * JSON 存在チェック
   *
   * @param folderId フォルダID
   * @param name JSON名(.jsonなし)
   * @returns true:存在する/false:存在しない
   */
  public exists(folderId: string, name: string): boolean {
    const folder = this.iGoogleDrive.getFolder(folderId);
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
    const folder = this.iGoogleDrive.getFolder(folderId);
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
    const folder = this.iGoogleDrive.getFolder(folderId);
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

    const folder = this.iGoogleDrive.getFolder(folderId);
    const file = folder.getFilesByName(name).next();
    folder.removeFile(file);
  }

  /**
   * Web API の JSON レスポンスを作成する
   *
   * @param json json
   * @returns json レスポンス
   */
  public createJsonResponse(json: string): GoogleAppsScript.Content.TextOutput {
    return ContentService.createTextOutput(json);
  }
}
