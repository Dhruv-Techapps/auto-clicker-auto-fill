import { RootState } from '@acf-options-page/store';
import { IAddon, TGoto, defaultAddon } from '@dhruv-techapps/acf-common';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { openActionAddonModalAPI } from './addon.api';

export interface IActionAddonStore {
  visible: boolean;
  error?: string;
  message?: string;
  addon: IAddon;
}

const initialState: IActionAddonStore = { visible: false, addon: { ...defaultAddon } };

const slice = createSlice({
  name: 'actionAddon',
  initialState,
  reducers: {
    updateActionAddon: (state, action) => {
      const { name, value } = action.payload;
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.addon[name] = value;
    },
    updateActionAddonGoto: (state, action: PayloadAction<TGoto>) => {
      state.addon.recheckGoto = action.payload;
    },
    switchActionAddonModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_addon', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setActionAddonMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionAddonError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;

      state.message = undefined;
    }
  },
  extraReducers(builder) {
    builder.addCase(openActionAddonModalAPI.fulfilled, (state, action) => {
      if (action.payload.addon) {
        state.addon = { ...action.payload.addon, recheckGoto: action.payload.recheckGoto };
      } else {
        state.addon = { ...defaultAddon };
      }
      state.visible = !state.visible;
    });
  }
});

export const { setActionAddonError, setActionAddonMessage, switchActionAddonModal, updateActionAddon, updateActionAddonGoto } = slice.actions;

export const actionAddonSelector = (state: RootState) => state.actionAddon;
export const actionAddonReducer = slice.reducer;
