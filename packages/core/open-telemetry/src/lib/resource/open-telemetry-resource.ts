import { detect } from '@dhruv-techapps/core-common';
import { DeviceStorage } from '@dhruv-techapps/core-store';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const deviceInfo = await DeviceStorage.getDeviceInfo();
const { version } = chrome.runtime.getManifest();

const browser = detect();

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'ACF',
  [ATTR_SERVICE_VERSION]: version,
  ...(deviceInfo?.id && { ['device.id']: deviceInfo.id }),
  ...(browser && {
    'browser.name': browser.name,
    'browser.version': browser.version,
    'os.name': browser.os || 'unknown'
  })
});

export { resource };
