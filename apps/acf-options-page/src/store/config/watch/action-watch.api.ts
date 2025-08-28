import { IActionWatchSettings } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

interface OpenActionWatchModalAPIResult {
  watch: IActionWatchSettings | undefined;
  selectedActionId: TRandomUUID;
}

export const openActionWatchModalAPI = createAsyncThunk<OpenActionWatchModalAPIResult, TRandomUUID, { state: RootState }>('action-watch/open', async (selectedActionId, thunkAPI) => {
  const { configuration } = thunkAPI.getState();
  const { selectedConfigId, configs } = configuration;
  const config = configs.find((c) => c.id === selectedConfigId);
  if (!config) throw new Error('Invalid Configuration');
  const action = config.actions.find((a) => a.id === selectedActionId);
  if (!action) throw new Error('Invalid Action');
  return { watch: action.watch, selectedActionId };
});
