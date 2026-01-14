/// <reference types="chrome"/>

import { IExtension } from '@dhruv-techapps/core-common';

declare global {
  interface Window {
    EXTENSION_ID?: string;
    ext: IExtension;
  }
}

export * from './lib/background/chrome/messenger';
export * from './lib/background/chrome/runtime';
