import { EErrorOptions, IAddon, TGoto } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

interface OpenActionAddonModalAPIResult {
  addon: IAddon | undefined;
  selectedActionId: TRandomUUID;
  recheckGoto: TGoto | undefined;
}

export const openActionAddonModalAPI = createAsyncThunk<OpenActionAddonModalAPIResult, TRandomUUID, { state: RootState }>('action-addon/open', async (selectedActionId, thunkAPI) => {
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
  const { addon } = action;
  let recheckGoto = addon?.recheckGoto;
  if (addon?.recheckOption === EErrorOptions.GOTO && typeof addon.recheckGoto === 'number') {
    recheckGoto = config.actions[addon.recheckGoto].id;
  }
  return { addon: action.addon, selectedActionId, recheckGoto };
});
