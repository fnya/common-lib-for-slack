export interface ISpreadSheetManager {
  exists(folderId: string, sheetName: string): boolean;
  create(folderId: string, sheetName: string): void;
  load(folderId: string, sheetName: string): string[][];
  save(folderId: string, sheetName: string, arrays: string[][]): void;
  update(folderId: string, sheetName: string, arrays: string[][]): void;
  getLatestTs(folderId: string, sheetName: string): string;
}
