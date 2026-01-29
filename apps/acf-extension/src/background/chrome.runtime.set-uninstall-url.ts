import { UNINSTALL_URL } from '../common/environments';

if (UNINSTALL_URL) {
  try {
    chrome.runtime.setUninstallURL(UNINSTALL_URL, () => {
      if (chrome.runtime.lastError) {
        console.error(
          'Failed to set uninstall URL:',
          UNINSTALL_URL,
          chrome.runtime.lastError
        );
      } else {
        console.info('Successfully set uninstall URL:', UNINSTALL_URL);
      }
    });
  } catch (error) {
    console.error('Unexpected error while setting uninstall URL:', error);
  }
}
