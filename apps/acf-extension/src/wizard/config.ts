import { IConfiguration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { ConfigStorage } from '@dhruv-techapps/acf-store';
import { store } from './store';
import { updatedConfig } from './store/slice';

export const Config = (() => {
  let unsubscribe: () => void;
  const subscribe = () => {
    unsubscribe = store.subscribe(async () => {
      const config = store.getState().wizard;
      const configs: Array<IConfiguration> = await ConfigStorage.getConfigs();
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
    const configs: Array<IConfiguration> = await ConfigStorage.getConfigs();
    const config = configs.find((_config) => _config.enable && _config.url === url);
    store.dispatch(updatedConfig(config));
  };

  const disconnect = () => {
    unsubscribe?.();
  };

  return { setup, disconnect };
})();
