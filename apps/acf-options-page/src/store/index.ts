import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app.slice';
import { blogReducer } from './blog';
import { configReducers, configsListenerMiddleware, configsToastListenerMiddleware } from './config';
import { firebaseReducer } from './firebase';
import { googleDriveReducer, googleReducer } from './google';
import { settingsListenerMiddleware, settingsReducer } from './settings';
import { subscribeReducer } from './subscribe';
import toastReducer from './toast.slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    settings: settingsReducer,
    toast: toastReducer,
    blog: blogReducer,
    google: googleReducer,
    googleDrive: googleDriveReducer,
    firebase: firebaseReducer,
    subscribe: subscribeReducer,
    ...configReducers
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(settingsListenerMiddleware.middleware, configsListenerMiddleware.middleware, configsToastListenerMiddleware.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export * from './app.api';
export * from './app.slice';
export * from './blog';
export * from './config';
export * from './firebase';
export * from './google';
export * from './hooks';
export * from './settings';
export * from './subscribe';
export * from './toast.slice';
