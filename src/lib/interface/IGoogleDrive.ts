/* eslint-disable no-undef */
export interface IGoogleDrive {
  existFolder(folderId: string, folderName: string): boolean;
  createFolder(folderId: string, folderName: string): void;
  createFolderOrGetFolderId(folderId: string, folderName: string): string;
  getFolder(folderId: string): GoogleAppsScript.Drive.Folder;
  backupFile(folderId: string, fileName: string): void;
  existFolderInRoot(folderName: string): boolean;
  createFolderInRoot(folderName: string): string;
  getFolderIdInRoot(folderName: string): string;
}
