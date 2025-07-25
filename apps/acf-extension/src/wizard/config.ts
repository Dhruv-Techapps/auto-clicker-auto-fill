import { IConfiguration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { store } from './store';
import { updatedConfig } from './store/slice';

export const Config = (() => {
  const subscribe = () => {
    store.subscribe(async () => {
      const config = store.getState().wizard;
      const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
      const configs: Array<IConfiguration> = storageResult.configs || [];
      const index = configs.findIndex((_config) => _config.enable && _config.url === config.url);
      if (index !== -1) {
        configs[index] = config;
      } else {
        configs.push(config);
      }
      chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: configs });
    });
  };

  const setup = async () => {
    const { origin, pathname } = document.location;
    const url = origin + pathname;
    subscribe();
    const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
    const configs: Array<IConfiguration> = storageResult.configs || [];
    const config = configs.find((_config) => _config.enable && _config.url === url);
    store.dispatch(updatedConfig(config));
  };

  return { setup };
})();
