/// <reference types="chrome"/>
export * from './lib/firebase-oauth-background';
export { RUNTIME_MESSAGE_FIREBASE_OAUTH } from './lib/firebase-oauth.constant';
export * from './lib/firebase-oauth.types';
import { IExtension } from '@dhruv-techapps/core-common';

declare global {
  interface Window {
    EXTENSION_ID?: string;
    ext: IExtension;
  }
  var EXTENSION_ID: string | undefined;
}
