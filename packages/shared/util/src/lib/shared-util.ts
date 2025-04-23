import { getRandomValues } from '@dhruv-techapps/core-common';

export const Timer = (function () {
  const getWaitTime = (time?: number | string) => {
    let waitTime;
    if (time) {
      if (typeof time === 'string') {
        if (/^\d+(\.\d+)?e\d+(\.\d+)?$/.test(time)) {
          const [start, end] = time
            .toString()
            .split('e')
            .map((n) => Number(n));
          waitTime = (Math.floor(getRandomValues() * (end - start)) + start) * 1000;
        }
      } else if (time > 0) {
        waitTime = Number(time) * 1000;
      }
    }
    return waitTime;
  };

  const sleep = async (waitTime?: number) => {
    if (waitTime) {
      await new Promise((resolve) => {
        setTimeout(resolve, waitTime);
      });
    }
  };

  const getTimeAndSleep = async (time?: number | string) => {
    const waitTime = getWaitTime(time);
    await sleep(waitTime);
  };

  return {
    getWaitTime,
    getTimeAndSleep,
    sleep
  };
})();
