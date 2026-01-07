import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { googleHasAccessAPI, googleLoginAPI } from './google-login.api';

export interface IGoogleStore {
  error?: string;
  googleLoading: boolean;
  grantedScopes: string[];
}

const initialState: IGoogleStore = { grantedScopes: [], googleLoading: false };

const slice = createSlice({
  name: 'google',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(googleLoginAPI.fulfilled, (state, action) => {
      if (action.payload.grantedScopes) {
        state.grantedScopes?.push(...action.payload.grantedScopes);
      }
    });
    builder.addCase(googleLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Google Login', state.error || 'Unknown Error');
    });
    builder.addCase(googleHasAccessAPI.pending, (state) => {
      state.googleLoading = true;
    });
    builder.addCase(googleHasAccessAPI.fulfilled, (state, action) => {
      if (action.payload.grantedScopes) {
        state.grantedScopes?.push(...action.payload.grantedScopes);
      }
      state.googleLoading = false;
    });
    builder.addCase(googleHasAccessAPI.rejected, (state, action) => {
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Google Login', state.error || 'Unknown Error');
      state.googleLoading = false;
    });
  }
});

export const googleSelector = (state: RootState) => state.google;
export const googleReducer = slice.reducer;
