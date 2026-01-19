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
      const updatedConfigs = configs.map((config) => {
        const updatedActions = config.actions.map((action) => {
          if (action.statement?.then !== undefined) {
            const thenOption = action.statement.then;
            delete action.statement.then;
            action.statement.option = thenOption;
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
