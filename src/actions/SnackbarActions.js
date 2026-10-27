const SnackbarActions = {
  CLOSE: 'SnackbarActions.CLOSE',
  OPEN: 'SnackbarActions.OPEN',

  close() {
    return { type: SnackbarActions.CLOSE };
  },
  // `highlight` aparece em negrito depois da mensagem.
  open(message, highlight = null) {
    return { message, highlight, type: SnackbarActions.OPEN };
  },
};

export default SnackbarActions;
