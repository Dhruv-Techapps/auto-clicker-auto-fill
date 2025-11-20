import { EStartTypes, EUrlMatch, IConfiguration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';

export interface GetConfigResult {
  autoConfig: IConfiguration | undefined;
  manualConfigs: Array<IConfiguration>;
}

export class ConfigStorage {
  static async getAllConfigs(): Promise<Array<IConfiguration>> {
    const { configs } = await chrome.storage.local.get<{ configs: IConfiguration[] }>(LOCAL_STORAGE_KEY.CONFIGS);
    return configs ?? [];
  }

  async getConfig(): Promise<GetConfigResult> {
    try {
      const { href } = document.location;
      const configs = await ConfigStorage.getAllConfigs();
      let autoConfig: IConfiguration | undefined;
      let manualConfigs: Array<IConfiguration> = [];
      let fullMatch = false;
      configs
        .filter((config) => config.enable && config.url)
        .forEach((config) => {
          if (config.url_match !== EUrlMatch.EXACT && this.urlMatcher(config.url, href)) {
            manualConfigs.push(config);
            if (!autoConfig && config.startType === EStartTypes.AUTO) {
              autoConfig = config;
            }
          }
          if (!fullMatch && config.url === href && config.startType === EStartTypes.AUTO) {
            autoConfig = config;
            fullMatch = true;
          }
        });

      manualConfigs = manualConfigs.filter((config) => config.startType === EStartTypes.MANUAL && (!autoConfig || autoConfig.id !== config.id));
      return { autoConfig, manualConfigs };
    } catch (error) {
      console.warn(error);
    }
    return { autoConfig: undefined, manualConfigs: [] };
  }

  //getConfigById
  async getConfigById(id: string): Promise<IConfiguration | undefined> {
    const configs = await ConfigStorage.getAllConfigs();
    return configs.find((config) => config.id === id);
  }

  async getConfigsByUrl(url: string): Promise<Array<IConfiguration>> {
    let configs = await ConfigStorage.getAllConfigs();
    configs = configs.filter((config) => config.enable && config.url && this.urlMatcher(url, config.url));
    return configs;
  }

  urlMatcher(url: string, href: string) {
    return new RegExp(url).test(href) || href.indexOf(url) !== -1;
  }
}
