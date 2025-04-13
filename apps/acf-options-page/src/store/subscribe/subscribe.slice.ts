import { FirebaseFirestoreService, Product, Subscription } from '@dhruv-techapps/shared-firebase-firestore';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../store';

type SubscribeStore = { visible: boolean; isPortalLinkLoading: boolean; subscriptions?: Subscription[]; error?: string; products?: Product[]; isSubscribing: boolean };

const initialState: SubscribeStore = {
  visible: false,
  isSubscribing: false,
  isPortalLinkLoading: false
};

export const getProducts = createAsyncThunk('firebase/getProducts', async () => {
  const result = await FirebaseFirestoreService.getProducts();
  return result;
});

export const getSubscription = createAsyncThunk('firebase/getSubscription', async (_, thunkAPI) => {
  const subscription = await FirebaseFirestoreService.getSubscriptions();
  if (!subscription) {
    thunkAPI.dispatch(getProducts());
  }
  return subscription;
});

export const subscribe = createAsyncThunk('firebase/subscribe', async (priceId: string) => {
  const result = await FirebaseFirestoreService.subscribe(priceId);
  if (result) {
    window.location.href = result;
  }
  return result;
});

const slice = createSlice({
  name: 'subscribe',
  initialState,
  reducers: {
    switchSubscribeModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'subscribe', visibility: !state.visible });
      state.visible = !state.visible;
    },
    switchIsPortalLinkLoading: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'manage-subscribe', visibility: !state.visible });
      state.isPortalLinkLoading = !state.isPortalLinkLoading;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSubscription.fulfilled, (state, action) => {
      state.subscriptions = action.payload;
    });
    builder.addCase(getSubscription.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
    });
    builder.addCase(subscribe.pending, (state) => {
      state.isSubscribing = true;
    });
    builder.addCase(subscribe.rejected, (state, action) => {
      state.isSubscribing = false;
      state.error = action.error.message;
      Sentry.captureException(state.error);
    });
  }
});

export const { switchSubscribeModal, switchIsPortalLinkLoading } = slice.actions;

export const subscribeSelector = (state: RootState) => state.subscribe;

export const subscribeReducer = slice.reducer;
