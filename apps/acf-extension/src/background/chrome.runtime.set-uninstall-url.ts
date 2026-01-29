import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { UNINSTALL_URL } from '../common/environments';

if (UNINSTALL_URL) {
  try {
    chrome.runtime.setUninstallURL(UNINSTALL_URL, () => {
      if (chrome.runtime.lastError) {
        Logger.error('Failed to set uninstall URL:', chrome.runtime.lastError);
      } else {
        Logger.info('Successfully set uninstall URL:');
      }
    });
  } catch (error) {
    Logger.error('Unexpected error while setting uninstall URL:', error);
  }
}
