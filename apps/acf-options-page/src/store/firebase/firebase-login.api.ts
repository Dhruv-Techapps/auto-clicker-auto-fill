import { FirebaseOauthService } from '@dhruv-techapps/shared-firebase-oauth';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const firebaseIsLoginAPI = createAsyncThunk('firebase/isLogin', async () => {
  const response = await FirebaseOauthService.isLogin();
  return response;
});

export const firebaseLoginAPI = createAsyncThunk('firebase/login', async () => {
  const response = await FirebaseOauthService.login();
  return response;
});

export const firebaseLogoutAPI = createAsyncThunk('firebase/logout', async () => {
  const result = await FirebaseOauthService.logout();
  return result;
});
