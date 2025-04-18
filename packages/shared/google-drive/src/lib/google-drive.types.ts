export type DriveFile = {
  id: string;
  name: string;
  modifiedTime: string;
  content?: string;
};

export type GoogleDriveFile = {
  nextPageToken: string;
  kind: string;
  incompleteSearch: boolean;

  files: Array<DriveFile>;
};

export enum AUTO_BACKUP {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  OFF = 'off'
}
