import { FirebaseRole, User } from '@dhruv-techapps/shared-firebase-oauth';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../store';
import { firebaseIsLoginAPI, firebaseLoginAPI, firebaseLogoutAPI } from './firebase-login.api';

export interface IFirebaseStore {
  visible: boolean;
  error?: string;
  message?: string;
  isLoading: boolean;
  user?: User | null;
  role?: FirebaseRole;
}

const initialState: IFirebaseStore = { visible: false, isLoading: true };

const slice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    switchFirebaseLoginModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'firebase-login', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setFirebaseLoginMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setFirebaseLoginError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(firebaseIsLoginAPI.fulfilled, (state, action) => {
      if (action.payload?.user) {
        state.user = action.payload.user;
        state.role = action.payload.role;
        Sentry.setUser({ id: action.payload.user.uid });
      }
      state.isLoading = false;
    });
    builder.addCase(firebaseIsLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
      Sentry.captureException(state.error);
    });
    builder.addCase(firebaseLoginAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(firebaseLoginAPI.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.role = action.payload.role;
        Sentry.setUser({ id: action.payload.user?.uid });
      }
      state.isLoading = false;
      state.visible = false;
    });
    builder.addCase(firebaseLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
      state.isLoading = false;
    });
    builder.addCase(firebaseLogoutAPI.fulfilled, (state) => {
      delete state.user;
      delete state.role;
    });
    builder.addCase(firebaseLogoutAPI.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
    });
  }
});

export const { switchFirebaseLoginModal, setFirebaseLoginMessage, setFirebaseLoginError } = slice.actions;

export const firebaseSelector = (state: RootState) => state.firebase;
export const firebaseReducer = slice.reducer;
