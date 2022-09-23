/* eslint-disable no-undef */
export interface IJsonUtil {
  exists(folderId: string, name: string): boolean;
  load(folderId: string, name: string): string;
  save(folderId: string, name: string, json: string): void;
  remove(folderId: string, name: string): void;
  createJsonResponse(json: string): GoogleAppsScript.Content.TextOutput;
}
