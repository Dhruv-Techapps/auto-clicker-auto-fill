import { UNINSTALL_URL } from '../common/environments';

if (UNINSTALL_URL) chrome.runtime.setUninstallURL(UNINSTALL_URL);
