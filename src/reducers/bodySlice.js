import { createSlice } from '@reduxjs/toolkit';

// O loading global (components/loading/AppLoading) e o menu do celular.
const bodySlice = createSlice({
  name: 'body',
  initialState: {
    hasMobileMenu: false,
    isLoading: false,
  },
  reducers: {
    showLoading(state) {
      state.isLoading = true;
    },
    hideLoading(state) {
      state.isLoading = false;
    },
    showMobileMenu(state) {
      state.hasMobileMenu = true;
    },
    hideMobileMenu(state) {
      state.hasMobileMenu = false;
    },
  },
});

export const { showLoading, hideLoading, showMobileMenu, hideMobileMenu } = bodySlice.actions;
export default bodySlice.reducer;
