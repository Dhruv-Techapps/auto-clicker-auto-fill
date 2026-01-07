import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_GOOGLE_ANALYTICS } from './google-analytics.constant';
import { TEventSource } from './google-analytics.types';

export class GoogleAnalyticsService extends CoreService {
  static override shouldTrace = false;
  static async fireEvent(name: string, params: Record<string, unknown> & { source: TEventSource }) {
    return await this.message({ messenger: RUNTIME_MESSAGE_GOOGLE_ANALYTICS, methodName: 'fireEvent', message: { name, params } });
  }

  static async firePageViewEvent(pageTitle: string, pageLocation: string, name?: string, additionalParams?: Record<string, unknown> & { source: TEventSource }) {
    return await this.message({ messenger: RUNTIME_MESSAGE_GOOGLE_ANALYTICS, methodName: 'firePageViewEvent', message: { pageTitle, pageLocation, name, additionalParams } });
  }

  static async fireErrorEvent(name: string, error: string, additionalParams?: Record<string, unknown> & { source: TEventSource }) {
    return await this.message({ messenger: RUNTIME_MESSAGE_GOOGLE_ANALYTICS, methodName: 'fireErrorEvent', message: { error, name, additionalParams } });
  }
}
