import { IWatchSettings } from '@dhruv-techapps/acf-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';

interface OpenWatchModalAPIResult {
  watch: IWatchSettings | undefined;
}

export const openWatchModalAPI = createAsyncThunk<OpenWatchModalAPIResult, void, { state: RootState }>('watch/open', async (_, thunkAPI) => {
  const { configuration } = thunkAPI.getState();
  const { selectedConfigId, configs } = configuration;
  const config = configs.find((c) => c.id === selectedConfigId);
  if (!config) throw new Error('Invalid Configuration');
  return { watch: config.watch };
});
