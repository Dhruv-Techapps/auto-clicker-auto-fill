import { DeviceStorage, UserStorage } from '@dhruv-techapps/core-store';
import { DEFAULT_ENGAGEMENT_TIME_MSEC, GA_DEBUG_ENDPOINT, GA_ENDPOINT, SESSION_EXPIRATION_IN_MIN } from './google-analytics.constant';
import { FireErrorEventParams, FireEventParams, FirePageViewEventParams } from './google-analytics.types';

export class GoogleAnalyticsBackground {
  debug: boolean;
  constructor(
    private readonly MEASUREMENT_ID?: string,
    private readonly API_SECRET?: string,
    debug = false
  ) {
    this.MEASUREMENT_ID = MEASUREMENT_ID;
    this.API_SECRET = API_SECRET;
    this.debug = debug;
  }

  // Returns the client id, or creates a new one if one doesn't exist.
  // Stores client id in local storage to keep the same client id as long as
  // the extension is installed.
  async getClientId() {
    const deviceInfo = await DeviceStorage.getDeviceInfo();
    return deviceInfo.id;
  }

  async getUserId() {
    const userId = await UserStorage.getUserId();
    return userId;
  }

  // Returns the current session id, or creates a new one if one doesn't exist or
  // the previous one has expired.
  async getOrCreateSessionId() {
    // Use storage.session because it is only in memory
    let { sessionData } = await chrome.storage.session.get<{ sessionData: { session_id: string; timestamp: number } | null }>('sessionData');
    const currentTimeInMs = Date.now();
    // Check if session exists and is still valid
    if (sessionData?.timestamp) {
      // Calculate how long ago the session was last updated
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      // Check if last update lays past the session expiration threshold
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        // Clear old session id to start a new session
        sessionData = null;
      } else {
        // Update timestamp to keep session alive
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
      }
    }
    if (!sessionData) {
      // Create and store a new session
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs
      };
      await chrome.storage.session.set({ sessionData });
    }
    return sessionData.session_id;
  }

  async fireEvent({ name, params = { source: 'unknown' } }: FireEventParams) {
    if (!this.MEASUREMENT_ID || !this.API_SECRET) {
      return;
    }
    if (!params.session_id) {
      params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }
    params.version = chrome.runtime.getManifest().version;

    try {
      await fetch(`${this.debug ? GA_DEBUG_ENDPOINT : GA_ENDPOINT}?measurement_id=${this.MEASUREMENT_ID}&api_secret=${this.API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify({
          client_id: await this.getClientId(),
          user_id: await this.getUserId(),
          events: [
            {
              name,
              params
            }
          ]
        })
      });
      if (!this.debug) {
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Fire a page view event.
  async firePageViewEvent({ name = 'page_view', pageTitle, pageLocation, additionalParams = {} }: FirePageViewEventParams) {
    return this.fireEvent({
      name,
      params: {
        source: 'unknown',
        page_title: pageTitle,
        page_location: pageLocation,
        ...additionalParams
      }
    });
  }

  // Fire an error event.
  async fireErrorEvent({ name = 'extension_error', error, additionalParams = {} }: FireErrorEventParams) {
    return this.fireEvent({
      name,
      params: {
        source: 'unknown',
        error,
        ...additionalParams
      }
    });
  }
}
