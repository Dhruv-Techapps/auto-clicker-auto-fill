import { ICoreModel } from '@dhruv-techapps/core-common';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    dataLayer: any;
    adsLoaded: boolean;
    adsbygoogle: any;
    core: ICoreModel;
  }
}
declare module 'react-table';
export {};
