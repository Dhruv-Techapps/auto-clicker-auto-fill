/// <reference types="chrome"/>

import { IExtension } from '@dhruv-techapps/core-common';

export * from './lib';

declare global {
  interface Window {
    ext: IExtension;
  }
}
