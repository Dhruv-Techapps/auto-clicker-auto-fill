import { ERetryOptions, IActionStatement, TGoto } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

interface OpenActionStatementModalAPIResult {
  statement: IActionStatement | undefined;
  selectedActionId: TRandomUUID;
  firstActionId: TRandomUUID;
  goto: TGoto | undefined;
}

export const openActionStatementModalAPI = createAsyncThunk<OpenActionStatementModalAPIResult, TRandomUUID, { state: RootState }>('action-statement/open', async (selectedActionId, thunkAPI) => {
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
  const { statement } = action;
  let goto = statement?.goto;
  if (statement?.then === ERetryOptions.GOTO && typeof statement.goto === 'number') {
    goto = config.actions[statement.goto].id;
  }
  return { statement: statement, selectedActionId, goto, firstActionId: config.actions[0].id };
});
