import { createSlice } from '@reduxjs/toolkit';

// Mensagens para o usuário: o alerta (modal com OK), o diálogo de confirmação
// e o snackbar. Mostrados por components/Alert, Confirm e Snackbar.
const initialState = {
  alert: { isOpened: false, message: '' },
  confirm: { isOpened: false, title: '', message: '', labelYes: '', labelNo: '' },
  // `highlight` aparece em negrito depois da mensagem.
  snackbar: { isOpened: false, message: '', highlight: null },
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    openAlert(state, action) {
      state.alert = { isOpened: true, message: action.payload };
    },
    closeAlert(state) {
      state.alert = initialState.alert;
    },
    openSnackbar: {
      reducer(state, action) {
        state.snackbar = { isOpened: true, ...action.payload };
      },
      prepare(message, highlight = null) {
        return { payload: { message, highlight } };
      },
    },
    closeSnackbar(state) {
      state.snackbar = initialState.snackbar;
    },
    openConfirm: {
      reducer(state, action) {
        state.confirm = { isOpened: true, ...action.payload };
      },
      prepare(title, message, labelYes, labelNo) {
        return { payload: { title, message, labelYes, labelNo } };
      },
    },
    closeConfirm(state) {
      state.confirm = initialState.confirm;
    },
  },
});

export const { openAlert, closeAlert, openSnackbar, closeSnackbar } = messagesSlice.actions;

// Quem resolve a Promise do diálogo de confirmação aberto. Fica fora do state
// porque é uma função; o state guarda só os textos.
let resolvePending = null;

// Abre o diálogo de confirmação e devolve uma Promise que resolve com true
// (sim) ou false (não, ou fechou o diálogo).
export function askConfirmation(title, message, labelYes, labelNo) {
  return dispatch => {
    if (resolvePending) {
      resolvePending(false);
    }
    dispatch(messagesSlice.actions.openConfirm(title, message, labelYes, labelNo));
    return new Promise(resolve => {
      resolvePending = resolve;
    });
  };
}

export function answerConfirmation(confirmed) {
  return dispatch => {
    const resolve = resolvePending;
    resolvePending = null;
    dispatch(messagesSlice.actions.closeConfirm());
    if (resolve) {
      resolve(confirmed);
    }
  };
}

export default messagesSlice.reducer;
