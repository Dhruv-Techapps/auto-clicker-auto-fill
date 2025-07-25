import { ERetryOptions, IActionCondition, IActionStatement, TGoto } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../../../store';
import { openActionStatementModalAPI } from './statement.api';

export interface IActionStatementStore {
  visible: boolean;
  error?: string;
  message?: string;
  statement: Partial<IActionStatement>;
}

const initialState: IActionStatementStore = { visible: false, statement: {} };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface StatementCondition {
  name: string;
  value: any;
  id: TRandomUUID;
}

const slice = createSlice({
  name: 'actionStatement',
  initialState,
  reducers: {
    updateActionStatementCondition: (state, action: PayloadAction<StatementCondition>) => {
      const { name, value, id } = action.payload;
      const condition = state.statement.conditions?.find((condition) => condition.id === id);
      if (!condition) {
        state.error = 'Invalid Condition';
        Sentry.captureException(state.error);
      } else {
        // @ts-expect-error "making is generic function difficult for TypeScript"
        condition[name] = value;
      }
    },
    addActionStatementCondition: (state, action: PayloadAction<IActionCondition>) => {
      if (state.statement.conditions) {
        state.statement.conditions.push(action.payload);
      } else {
        state.statement.conditions = [action.payload];
      }
      state.error = undefined;
    },
    removeActionStatementCondition: (state, action: PayloadAction<TRandomUUID>) => {
      const conditionIndex = state.statement.conditions?.findIndex((condition) => condition.id === action.payload);
      if (conditionIndex === -1 || conditionIndex === undefined) {
        state.error = 'Invalid Condition';
        Sentry.captureException(state.error);
      } else {
        state.statement.conditions?.splice(conditionIndex, 1);
      }
    },
    updateActionStatementThen: (state, action: PayloadAction<ERetryOptions>) => {
      state.statement.then = action.payload;
    },
    updateActionStatementGoto: (state, action: PayloadAction<TGoto>) => {
      state.statement.goto = action.payload;
    },
    switchActionStatementModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_statement', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setActionStatementMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionStatementError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    }
  },
  extraReducers(builder) {
    builder.addCase(openActionStatementModalAPI.fulfilled, (state, action) => {
      if (action.payload.statement) {
        state.statement = { ...action.payload.statement, goto: action.payload.goto };
      } else {
        state.statement = {};
      }
      state.visible = !state.visible;
    });
  }
});

export const {
  addActionStatementCondition,
  removeActionStatementCondition,
  setActionStatementError,
  setActionStatementMessage,
  switchActionStatementModal,
  updateActionStatementCondition,
  updateActionStatementGoto,
  updateActionStatementThen
} = slice.actions;

export const actionStatementSelector = (state: RootState) => state.actionStatement;
export const actionStatementReducer = slice.reducer;
