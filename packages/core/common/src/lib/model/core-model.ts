import { TRandomUUID } from '../utilities';

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
  __actionKey: TRandomUUID;
  __actionRepeat: number;
  __addonRecheck: number;
  __batchRepeat: number;
  __sessionCount: number;
  __sheets?: ISheets;
  __configHeaders?: Record<string, string>;
  __batchHeaders?: Record<string, string>;
  __actionHeaders?: Record<string, string>;
}
