import { EErrorOptions, IActionSettings, TGoto } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

interface OpenActionSettingsModalAPIResult {
  settings: IActionSettings | undefined;
  selectedActionId: TRandomUUID;
  retryGoto: TGoto | undefined;
}

export const openActionSettingsModalAPI = createAsyncThunk<OpenActionSettingsModalAPIResult, TRandomUUID, { state: RootState }>('action-setting/open', async (selectedActionId, thunkAPI) => {
  const { configuration } = thunkAPI.getState();
  const { selectedConfigId, configs } = configuration;

  const config = configs.find((config) => config.id === selectedConfigId);
  if (!config) {
    throw new Error('Invalid Configuration');
  }
  const action = config.actions.find((action) => action.id === selectedActionId);
  if (!action) {
    throw new Error('Invalid Action');
  }
  const { settings } = action;
  let retryGoto = settings?.retryGoto;
  if (settings?.retryOption === EErrorOptions.GOTO && typeof settings.retryGoto === 'number') {
    retryGoto = config.actions[settings.retryGoto].id;
  }
  return { settings: action.settings, selectedActionId, retryGoto };
});
