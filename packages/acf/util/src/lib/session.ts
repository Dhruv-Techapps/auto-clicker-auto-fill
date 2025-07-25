import { TRandomUUID } from '@dhruv-techapps/core-common';

export class Session {
  private readonly SESSION_COUNT_KEY;
  private readonly SESSION_CLEAR_PARAM = 'clear-acf-session';

  constructor(id: TRandomUUID) {
    this.SESSION_COUNT_KEY = `acf-session-count-${id}`;
  }

  getCount = (): number => {
    this.check();
    const sessionCount = sessionStorage.getItem(this.SESSION_COUNT_KEY);
    const count = sessionCount ? Number(sessionCount) : 1;
    sessionStorage.setItem(this.SESSION_COUNT_KEY, String(count + 1));
    return count;
  };

  check = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get(this.SESSION_CLEAR_PARAM)) {
      sessionStorage.removeItem(this.SESSION_COUNT_KEY);
    }
    const sessionCount = urlParams.get(this.SESSION_COUNT_KEY);
    if (sessionCount && !isNaN(Number(sessionCount))) {
      sessionStorage.setItem(this.SESSION_COUNT_KEY, sessionCount);
    }
  };
}
