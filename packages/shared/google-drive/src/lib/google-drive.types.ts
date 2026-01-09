export interface IDriveFile {
  id: string;
  name: string;
  modifiedTime: string;
  content?: string;
}

export interface IGoogleDriveFile {
  nextPageToken: string;
  kind: string;
  incompleteSearch: boolean;

  files: Array<IDriveFile>;
}
