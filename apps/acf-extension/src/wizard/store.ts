import { configureStore } from '@reduxjs/toolkit';
import { wizardReducer } from './store/slice';

export const store = configureStore({
  reducer: {
    wizard: wizardReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
