/// <reference types="chrome"/>

declare global {
  interface Window {
    EXTENSION_ID?: string;
  }

  var EXTENSION_ID: string | undefined;
}

export * from './lib';
