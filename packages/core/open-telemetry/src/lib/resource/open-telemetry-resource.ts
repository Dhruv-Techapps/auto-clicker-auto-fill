import { DeviceStorage } from '@dhruv-techapps/core-store';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const deviceInfo = await DeviceStorage.getDeviceInfo();
const { version } = chrome.runtime.getManifest();

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'Auto Clicker & Auto Fill',
  [ATTR_SERVICE_VERSION]: version,
  ...(deviceInfo?.id && { ['device.id']: deviceInfo.id })
});

export { resource };
