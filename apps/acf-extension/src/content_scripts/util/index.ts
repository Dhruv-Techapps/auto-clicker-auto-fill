import { Logger } from '@dhruv-techapps/core-common';

export const sleep = async (msec: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, msec);
  });

export const wait = async (time?: number | string, type = '', ...args: Array<string | number>) => {
  if (time) {
    let waitTime;
    if (typeof time === 'string') {
      if (/^\d+(\.\d+)?e\d+(\.\d+)?$/.test(time)) {
        const [start, end] = time
          .toString()
          .split('e')
          .map((n) => Number(n));
        waitTime = (Math.floor(Math.random() * (end - start)) + start) * 1000;
      }
    } else {
      waitTime = Number(time) * 1000;
    }
    if (waitTime) {
      Logger.colorDebug(type, ...args, `${waitTime / 1000} sec`);
      await sleep(waitTime);
    }
  }
};
