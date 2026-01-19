import { ConfigStorage } from '@dhruv-techapps/acf-store';

export class StorageMigration {
  static async migrate(): Promise<void> {
    await this.migrateThen();
  }

  static async migrateThen(): Promise<void> {
    const configs = await ConfigStorage.getConfigs();
    const needsMigration = configs.some((config) => config.actions.some((action) => action.statement?.then !== undefined));
    if (needsMigration) {
      ConfigStorage.getConfigs().then((configs) => {
        const updatedConfigs = configs.map((config) => {
          const updatedActions = config.actions.map((action) => {
            if (action.statement?.then !== undefined) {
              const { then: thenOption, ...restStatement } = action.statement;
              const updatedStatement = {
                ...restStatement,
                option: thenOption,
              };
              return {
                ...action,
                statement: updatedStatement,
              };
            }
            return action;
          });
          return {
            ...config,
            actions: updatedActions,
          };
        });
        ConfigStorage.setConfigs(updatedConfigs);
      });
    }
  }
}
