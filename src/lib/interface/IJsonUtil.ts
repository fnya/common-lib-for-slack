export interface IJsonUtil {
  exists(folderId: string, name: string): boolean;
  load(folderId: string, name: string): string;
  save(folderId: string, name: string, json: string): void;
  remove(folderId: string, name: string): void;
}
