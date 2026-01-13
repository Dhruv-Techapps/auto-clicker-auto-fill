import { EActionStatus, IUserScript } from '@dhruv-techapps/acf-common';
import { UserScriptsService } from '@dhruv-techapps/core-service';
import type { IUserScriptsExecuteResponse } from '@dhruv-techapps/core-types';
import { I18N_COMMON } from './i18n';

const USER_SCRIPTS_I18N = {
  TITLE: chrome.i18n.getMessage('@USER_SCRIPT__TITLE')
};

const UserScriptProcessor = (() => {
  const start = async (action: IUserScript): Promise<EActionStatus> => {
    const executeRequest = {
      ext: window.ext,
      code: action.value
    };
    return await UserScriptsService.execute(executeRequest)
      .then((response: IUserScriptsExecuteResponse) => {
        if (response.error) {
          console.error(`${USER_SCRIPTS_I18N.TITLE} #${window.ext.__currentAction}`, `❌ ${I18N_COMMON.ERROR}`);
          return EActionStatus.SKIPPED;
        }
        console.debug(`${USER_SCRIPTS_I18N.TITLE} #${window.ext.__currentAction}`, `✅ ${I18N_COMMON.COMPLETED}`);
        return EActionStatus.DONE;
      })
      .catch((error) => {
        console.error('Error executing UserScript:', error);
        return EActionStatus.SKIPPED;
      });
  };

  return { start };
})();

export default UserScriptProcessor;
