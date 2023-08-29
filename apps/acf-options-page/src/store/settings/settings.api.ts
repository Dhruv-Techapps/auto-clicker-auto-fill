import { GOOGLE_SCOPES, LOCAL_STORAGE_KEY, Settings } from '@dhruv-techapps/acf-common';
import { GoogleOauthService } from '@dhruv-techapps/acf-service';
import { StorageService } from '@dhruv-techapps/core-service';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const settingsGetAPI = createAsyncThunk('settings/get', async () => {
  const result = await StorageService.get<{ [LOCAL_STORAGE_KEY.SETTINGS]: Settings }>(window.EXTENSION_ID, LOCAL_STORAGE_KEY.SETTINGS);
  return result.settings;
});

export const googleGetAPI = createAsyncThunk('google/get', async () => {
  const result = await StorageService.get(window.EXTENSION_ID, [LOCAL_STORAGE_KEY.GOOGLE, LOCAL_STORAGE_KEY.GOOGLE_SCOPES]);
  return result;
});

export const googleLoginAPI = createAsyncThunk('google/login', async (scope: GOOGLE_SCOPES) => {
  const response = await GoogleOauthService.login(window.EXTENSION_ID, scope);
  return response;
});
export const googleLogoutAPI = createAsyncThunk('google/logout', async (scope: GOOGLE_SCOPES) => {
  const response = await GoogleOauthService.remove(window.EXTENSION_ID, scope);
  return response;
});
