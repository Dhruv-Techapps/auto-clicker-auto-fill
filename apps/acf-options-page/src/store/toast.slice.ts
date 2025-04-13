import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { ToastProps } from 'react-bootstrap';
import { RootState } from './store';

export type ToastHandlerProps = Omit<ToastProps, 'defaultValue'> & {
  header: string | ReactNode;
  body?: string | ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
};

const initialState: Array<ToastHandlerProps> = [];
const slice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToastHandlerProps>) => {
      state.push(action.payload);
    },
    hideToast: (state, action: PayloadAction<number>) => {
      state[action.payload].show = false;
    }
  }
});
export const { addToast, hideToast } = slice.actions;
export const toastSelector = (state: RootState) => state.toast;
export default slice.reducer;
