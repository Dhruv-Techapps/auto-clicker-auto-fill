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

export enum EAutoBackup {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  OFF = 'off'
}
