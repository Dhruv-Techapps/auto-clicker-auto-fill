import { defaultActionSettings, defaultActionWatchSettings, IActionSettings, TGoto } from '@dhruv-techapps/acf-common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../../../store';
import { openActionSettingsModalAPI } from './action-settings.api';

export interface IActionSettingsStore {
  visible: boolean;
  error?: string;
  message?: string;
  settings: IActionSettings;
}

export interface IActionSettingsRequest {
  name: string;
  value: boolean | string | number;
}

const initialState: IActionSettingsStore = { 
  visible: false, 
  settings: { 
    ...defaultActionSettings, 
    watch: { ...defaultActionWatchSettings } 
  } 
};

const slice = createSlice({
  name: 'actionSettings',
  initialState,
  reducers: {
    updateActionSettings: (state, action: PayloadAction<IActionSettingsRequest>) => {
      const { name, value } = action.payload;
      
      // Handle nested watch settings
      if (name.startsWith('watch.')) {
        if (!state.settings.watch) {
          state.settings.watch = {};
        }
        
        const watchProperty = name.replace('watch.', '');
        if (watchProperty.includes('.')) {
          // Handle nested properties like watch.lifecycleStopConditions.timeout
          const [parentProp, childProp] = watchProperty.split('.');
          if (parentProp === 'lifecycleStopConditions') {
            if (!state.settings.watch.lifecycleStopConditions) {
              state.settings.watch.lifecycleStopConditions = {};
            }
            if (childProp === 'timeout') {
              // Convert minutes to milliseconds
              state.settings.watch.lifecycleStopConditions.timeout = typeof value === 'number' ? value * 60000 : parseInt(value as string) * 60000;
            } else {
              // Only assign if childProp is a valid key of lifecycleStopConditions
              if (childProp in state.settings.watch.lifecycleStopConditions) {
                // Type assertion ensures type safety
                (state.settings.watch.lifecycleStopConditions as Record<string, unknown>)[childProp] = value;
              }
            }
          }
        } else {
          // Handle direct watch properties
          // @ts-expect-error "handling dynamic properties"
          state.settings.watch[watchProperty] = value;
        }
      } else {
        // Handle regular settings
        // @ts-expect-error "making is generic function difficult for TypeScript"
        state.settings[name] = value;
      }
    },
    switchActionSettingsModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_settings', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setActionSettingsMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionSettingsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    },
    updateActionSettingsGoto: (state, action: PayloadAction<TGoto>) => {
      state.settings.retryGoto = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(openActionSettingsModalAPI.fulfilled, (state, action) => {
      if (action.payload.settings) {
        state.settings = { 
          ...action.payload.settings, 
          retryGoto: action.payload.retryGoto,
          watch: {
            ...defaultActionWatchSettings,
            ...action.payload.settings.watch
          }
        };
      } else {
        state.settings = { 
          ...defaultActionSettings,
          watch: { ...defaultActionWatchSettings }
        };
      }
      state.visible = !state.visible;
    });
  }
});

export const { updateActionSettings, switchActionSettingsModal, updateActionSettingsGoto, setActionSettingsMessage, setActionSettingsError } = slice.actions;

export const actionSettingsSelector = (state: RootState) => state.actionSettings;
export const actionSettingsReducer = slice.reducer;
