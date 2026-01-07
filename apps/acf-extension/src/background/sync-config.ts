import { IConfiguration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { ConfigStorage } from '@dhruv-techapps/acf-store';
import { ConfigRequest, FirebaseFirestoreBackground } from '@dhruv-techapps/shared-firebase-firestore/background';
import { Auth } from '@dhruv-techapps/shared-firebase-oauth/background';
import { FirebaseStorageBackground } from '@dhruv-techapps/shared-firebase-storage/background';
import { EDGE_OAUTH_CLIENT_ID } from '../common/environments';

export const EVENTS_REGEX =
  /scrollto|clickevents|mouseevents|touchevents|formevents|keyevents|tabs|keyboardevents|attr|class|copy|paste|windowcommand|locationcommand|func|replace|append|prepend|clipboard|GoogleSheets/i;

export const VALUE_MATCHER = /<batchRepeat>|<actionRepeat>|<sessionCount>|<random\(([^)]+)\)>|<queryParam::([^>]+)>|<api::([^>]+)>/i;

const TAGS_REGEX =
  /Scrollto|ClickEvents|MouseEvents|TouchEvents|FormEvents|KeyEvents|Tabs|KeyboardEvents|Attr|Class|Copy|Paste|WindowCommand|LocationCommand|Func|Replace|Append|Prepend|Clipboard|GoogleSheets|BatchRepeat|ActionRepeat|SessionCount|Random|QueryParam|Api|Query/i;

export class SyncConfig {
  constructor(private readonly auth: Auth) {}

  filterConfig(configs: Array<IConfiguration>, updated: boolean): Array<IConfiguration> {
    if (updated) {
      return configs.filter((config: IConfiguration) => config.url && config.updated && !config.download);
    } else {
      return configs.filter((config: IConfiguration) => config.url && !config.download);
    }
  }

  maskStringWithAsterisks(input: string) {
    return input
      .split(' ') // Split string into words
      .map((word) => '*'.repeat(word.length)) // Replace each word with asterisks of equal length
      .join(' '); // Join words back with spaces
  }

  maskString(input: string) {
    let result = '';
    let lastIndex = 0;

    // Use the value matcher to find matches
    let match;
    while ((match = VALUE_MATCHER.exec(input)) !== null) {
      // Add * for the non-matching part before the current match, but preserve non-alphanumeric characters
      result += input.slice(lastIndex, match.index).replace(/[a-zA-Z0-9]/g, '*');

      // Add the matching part as is
      result += match[0];

      // Move the index to after the current match
      lastIndex = match.index + match[0].length;
    }

    // Handle any part of the string after the last match
    result += input.slice(lastIndex).replace(/[a-zA-Z0-9]/g, '*');

    return result;
  }

  async reset() {
    const configs: Array<IConfiguration> = await ConfigStorage.getConfigs();
    const updatedConfigs = configs.map((config: IConfiguration) => {
      delete config.updated;
      return config;
    });
    await chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: updatedConfigs });
  }

  getBlob(config: IConfiguration) {
    config.download = true;
    delete config.spreadsheetId;
    config.actions.forEach((action, index, actions) => {
      const { value } = action;

      if (value) {
        if (!EVENTS_REGEX.test(value)) {
          if (VALUE_MATCHER.test(value)) {
            action.value = this.maskString(value);
          } else {
            action.value = this.maskStringWithAsterisks(value);
          }
        }
      }
      if (action.addon) {
        const { value } = action.addon;
        if (value) {
          if (!EVENTS_REGEX.test(value)) {
            if (VALUE_MATCHER.test(value)) {
              action.addon.value = this.maskString(value);
            } else {
              action.addon.value = this.maskStringWithAsterisks(value);
            }
          }
        }
      }
      actions[index] = action;
    });
    return new Blob([JSON.stringify(config)], { type: 'application/json;charset=utf-8;' });
  }

  getTags(data: ConfigRequest, config: IConfiguration) {
    data.tags = Array.from(new Set(config.actions.map((action) => action.value?.match(TAGS_REGEX)?.[0].toLowerCase()).filter((value): value is string => !!value)));
    if (config.actions.find((action) => action.addon)) {
      data.tags.push('addon');
    }
  }

  async syncConfig(updated: boolean) {
    if (!this.auth.currentUser) {
      return;
    }
    try {
      const { uid } = this.auth.currentUser;
      const configs: Array<IConfiguration> = await ConfigStorage.getConfigs();
      const filteredConfigs: Array<IConfiguration> = this.filterConfig(configs, updated);
      if (filteredConfigs.length === 0) {
        console.log('No configs to sync');
        return;
      }
      for (const config of filteredConfigs) {
        try {
          // Update Database
          const data: ConfigRequest = { url: config.url, userId: uid, userName: this.auth.currentUser.displayName ?? '' };
          if (config.name) {
            data.name = config.name;
            this.getTags(data, config);
          }
          await new FirebaseFirestoreBackground(this.auth, EDGE_OAUTH_CLIENT_ID).setConfig(data, config.id);
          // Update Storage
          const blob = this.getBlob(config);
          await new FirebaseStorageBackground(this.auth).uploadFile(blob, `users/${uid}/${config.id}.json`);
        } catch (error) {
          console.error(`Failed to sync config ${config.id}:`, error);
        }
      }
      console.log(`Synced ${filteredConfigs.length} configs`);
      await this.reset();
    } catch (error) {
      console.error('Failed to sync configs:', error);
    }
  }
}
