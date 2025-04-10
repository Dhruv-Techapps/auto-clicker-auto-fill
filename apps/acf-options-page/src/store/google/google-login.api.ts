import { GOOGLE_SCOPES, GoogleOauthService } from '@dhruv-techapps/shared-google-oauth';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const googleLoginAPI = createAsyncThunk('google/login', async (scopes: GOOGLE_SCOPES[]) => {
  const response = await GoogleOauthService.login(scopes);
  return response;
});

export const googleHasAccessAPI = createAsyncThunk('google/hasAccess', async (scopes: GOOGLE_SCOPES[]) => {
  const response = await GoogleOauthService.hasAccess(scopes);
  return response;
});

export const googleLogoutAPI = createAsyncThunk('google/logout', async (scopes: GOOGLE_SCOPES[]) => {
  const response = await GoogleOauthService.logout(scopes);
  return response;
});
