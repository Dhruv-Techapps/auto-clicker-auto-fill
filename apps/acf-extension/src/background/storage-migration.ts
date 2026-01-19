import { ConfigStorage } from '@dhruv-techapps/acf-store';

export class StorageMigration {
  static async migrate(): Promise<void> {
    await this.migrateThen();
  }

  static async migrateThen(): Promise<void> {
    const configs = await ConfigStorage.getConfigs();
    const needsMigration = configs.some((config) => config.actions.some((action) => action.statement?.then !== undefined));
    if (needsMigration) {
      const updatedConfigs = configs.map((config) => {
        const updatedActions = config.actions.map((action) => {
          if (action.statement?.then !== undefined) {
            const { then: thenOption, option, ...restStatement } = action.statement;
            action.statement = {
              ...restStatement,
              option: option !== undefined ? option : thenOption
            };
          }
          return action;
        });
        config.actions = updatedActions;
        return config;
      });
      await ConfigStorage.setConfigs(updatedConfigs);
    }
  }
}
