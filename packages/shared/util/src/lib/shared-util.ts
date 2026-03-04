import { getRandomValues } from '@dhruv-techapps/core-common';

export const Timer = (function () {
  const getWaitTime = (time?: number, to?: number) => {
    let waitTime;
    if (time) {
      if (to !== undefined && time > 0 && to > 0) {
        waitTime = (Math.floor(getRandomValues() * (to - time)) + time) * 1000;
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

  const getTimeAndSleep = async (time?: number, to?: number) => {
    const waitTime = getWaitTime(time, to);
    await sleep(waitTime);
  };

  return {
    getWaitTime,
    getTimeAndSleep,
    sleep
  };
})();
