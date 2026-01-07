import { LocalStorage } from '@acf-options-page/_helpers';
import { RootState } from '@acf-options-page/store';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const HIDDEN_COLUMN_KEY = 'columnVisibility';
const defaultColumnVisibility = { name: true, initWait: false, repeat: false, repeatInterval: false };

export interface IActionStore {
  error?: string;
  message?: string;
  columnVisibility: { name: boolean; initWait: boolean; repeat: boolean; repeatInterval: boolean };
}

const initialState: IActionStore = {
  columnVisibility: LocalStorage.getItem(HIDDEN_COLUMN_KEY, defaultColumnVisibility)
};

const slice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    setColumnVisibility: (state, action: PayloadAction<string>) => {
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.columnVisibility[action.payload] = !state.columnVisibility[action.payload];
      LocalStorage.setItem(HIDDEN_COLUMN_KEY, state.columnVisibility);
    },
    setActionMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      GoogleAnalyticsService.fireErrorEvent('Action Table', state.error || 'Unknown Error');
      state.message = undefined;
    }
  }
});

export const { setActionMessage, setActionError, setColumnVisibility } = slice.actions;

export const actionSelector = (state: RootState) => state.action;
export const actionReducer = slice.reducer;
