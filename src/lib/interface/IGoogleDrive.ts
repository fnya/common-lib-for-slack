export interface IGoogleDrive {
  existFolder(folderId: string, folderName: string): boolean;
  createFolder(folderId: string, folderName: string): void;
  createFolderOrGetFolderId(folderId: string, folderName: string): string;
}
