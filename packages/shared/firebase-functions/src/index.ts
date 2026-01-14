export * from './lib/firebase-functions-background';
export { RUNTIME_MESSAGE_FIREBASE_FUNCTIONS } from './lib/firebase-functions.constant';
import { IExtension } from '@dhruv-techapps/core-common';

declare global {
  interface Window {
    EXTENSION_ID?: string;
    ext: IExtension;
  }
  var EXTENSION_ID: string | undefined;
}
