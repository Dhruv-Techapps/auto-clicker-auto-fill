import { TRandomUUID } from '@dhruv-techapps/core-common';

export enum EErrorOptions {
  STOP = 'stop',
  SKIP = 'skip',
  RELOAD = 'reload',
  GOTO = 'goto'
}

export type TGoto = number | TRandomUUID;
