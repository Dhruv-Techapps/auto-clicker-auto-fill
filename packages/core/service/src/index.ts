/// <reference types="chrome"/>

import { IExtension } from '@dhruv-techapps/core-common';

declare global {
  interface Window {
    EXTENSION_ID?: string;
    ext: IExtension;
  }
  var EXTENSION_ID: string | undefined;
}

export * from './lib';
