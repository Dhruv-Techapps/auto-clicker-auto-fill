import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { IDriveFile } from '@dhruv-techapps/shared-google-drive/service';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { googleDriveDeleteAPI, googleDriveListWithContentAPI } from './google-drive.api';

export interface IGoogleDriveStore {
  files: Array<IDriveFile>;
  filesLoading: boolean;
  error?: string;
}

const initialState: IGoogleDriveStore = { filesLoading: false, files: [] };

const slice = createSlice({
  name: 'googleDrive',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(googleDriveListWithContentAPI.pending, (state) => {
      state.filesLoading = true;
      delete state.error;
    });
    builder.addCase(googleDriveListWithContentAPI.fulfilled, (state, action) => {
      state.filesLoading = false;
      state.files = action.payload;
    });
    builder.addCase(googleDriveListWithContentAPI.rejected, (state, action) => {
      state.filesLoading = false;
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Google Drive List', state.error || 'Unknown Error');
    });
    builder.addCase(googleDriveDeleteAPI.fulfilled, (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload.id);
    });
  }
});

export const googleDriveSelector = (state: RootState) => state.googleDrive;
export const googleDriveReducer = slice.reducer;
