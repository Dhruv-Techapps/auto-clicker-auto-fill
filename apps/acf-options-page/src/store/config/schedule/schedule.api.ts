import { RootState } from '@apps/acf-options-page/src/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const openScheduleModalAPI = createAsyncThunk('schedule/open', async (_, thunkAPI) => {
  const { configuration } = thunkAPI.getState() as RootState;
  const { selectedConfigId, configs } = configuration;
  const config = configs.find((config) => config.id === selectedConfigId);
  if (!config) {
    throw new Error('Invalid Configuration');
  }

  return config.schedule;
});
