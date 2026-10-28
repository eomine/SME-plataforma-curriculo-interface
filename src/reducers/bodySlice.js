import { createSlice } from '@reduxjs/toolkit';

// O loading global (components/loading/AppLoading) e o menu do celular.
//
// O loading é um contador: cada página ou request que espera algo soma um
// enquanto espera (utils/useGlobalLoading, withGlobalLoading) e o loading
// aparece enquanto o contador for maior que zero. Assim uma carga que termina
// não esconde o loading de outra que continua.
const bodySlice = createSlice({
  name: 'body',
  initialState: {
    hasMobileMenu: false,
    loadingCount: 0,
  },
  reducers: {
    loadingStarted(state) {
      state.loadingCount += 1;
    },
    loadingFinished(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
    showMobileMenu(state) {
      state.hasMobileMenu = true;
    },
    hideMobileMenu(state) {
      state.hasMobileMenu = false;
    },
  },
});

const { loadingStarted, loadingFinished } = bodySlice.actions;
export const { showMobileMenu, hideMobileMenu } = bodySlice.actions;

export const selectIsLoading = state => state.body.loadingCount > 0;

// Mostra o loading global enquanto a Promise não termina (dê certo ou não).
export function withGlobalLoading(dispatch, promise) {
  dispatch(loadingStarted());
  return promise.finally(() => dispatch(loadingFinished()));
}

export { loadingStarted, loadingFinished };
export default bodySlice.reducer;
