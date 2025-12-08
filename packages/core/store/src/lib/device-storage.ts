import { generateUUID } from '@dhruv-techapps/core-common';

export interface DeviceInfo {
  installDate: string;
  id: string;
}

export class DeviceStorage {
  static KEY = 'device_info';

  static async getDeviceInfo(): Promise<DeviceInfo> {
    const result = await chrome.storage.local.get<{ [DeviceStorage.KEY]: DeviceInfo }>([DeviceStorage.KEY]);
    let deviceInfo = result[DeviceStorage.KEY];
    if (deviceInfo === undefined) {
      deviceInfo = {
        installDate: new Date().toISOString(),
        id: generateUUID()
      };
      await chrome.storage.local.set({ [DeviceStorage.KEY]: deviceInfo });
    }
    return deviceInfo;
  }
}
