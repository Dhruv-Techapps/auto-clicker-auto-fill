import { generateUUID, TRandomUUID } from '@dhruv-techapps/core-common';

import { getDefaultAction, IAction } from './IAction';
import { IBatch } from './IBatch';
import { IUserScript } from './IUserscript';

export enum ELoadTypes {
  WINDOW = 'window',
  DOCUMENT = 'document'
}

export enum EStartTypes {
  AUTO = 'auto',
  MANUAL = 'manual'
}

export const defaultHotkey = 'Ctrl + Shift + A';

export enum EConfigSource {
  WIZARD = 'wizard',
  RECORDER = 'recorder',
  WEB = 'web'
}

export enum EUrlMatch {
  REGEX = 'regex',
  EXACT = 'exact'
}

export interface IBypass {
  alert?: boolean;
  confirm?: boolean;
  prompt?: boolean;
}

export interface ISchedule {
  date: string;
  time: string;
  repeat: number;
}
export const defaultSchedule: ISchedule = {
  date: '',
  time: '',
  repeat: 0
};

export interface IConfiguration {
  url: string;
  updated?: boolean;
  enable: boolean;
  startType: EStartTypes;
  loadType: ELoadTypes;
  actions: Array<IAction | IUserScript>;
  id: TRandomUUID;
  configId?: number;
  name?: string;
  initWait?: number;
  startTime?: string;
  schedule?: ISchedule;
  spreadsheetId?: string;
  hotkey?: string;
  batch?: IBatch;
  source?: EConfigSource;
  new?: boolean;
  url_match?: EUrlMatch;
  download?: boolean;
  bypass?: IBypass;
}

export const getDefaultConfig = (source?: EConfigSource, actions?: Array<IAction>): IConfiguration => ({
  url: '',
  source,
  id: generateUUID(),
  enable: true,
  startType: EStartTypes.AUTO,
  loadType: ELoadTypes.WINDOW,
  actions: actions || [getDefaultAction()],
  updated: true
});
