export interface ISheets {
  [index: string]: {
    startRange: string;
    endRange: string;
    values: Array<any>;
  };
}

export interface IExtension {
  __currentAction: number;
  __currentActionName: string;
  __actionError: string;
  __actionRepeat: number;
  __addonRecheck: number;
  __batchRepeat: number;
  __sessionCount: number;
  __sheets?: ISheets;
}

export interface ICoreModel {
  __extensionId: string;
  __releaseVersion: string;
  __productName: string;
}
