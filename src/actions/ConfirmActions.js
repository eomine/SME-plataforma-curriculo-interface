// Quem resolve a Promise do diálogo aberto. Fica fora do state porque é uma
// função; o reducer guarda só os textos.
let resolvePending = null;

const ConfirmActions = {
  CLOSE: 'ConfirmActions.CLOSE',
  OPEN: 'ConfirmActions.OPEN',

  // Abre o diálogo e devolve uma Promise que resolve com true (sim) ou false
  // (não, ou fechou o diálogo).
  open(title, message, labelYes, labelNo) {
    return dispatch => {
      if (resolvePending) {
        resolvePending(false);
      }
      dispatch({ title, message, labelYes, labelNo, type: ConfirmActions.OPEN });
      return new Promise(resolve => {
        resolvePending = resolve;
      });
    };
  },
  answer(confirmed) {
    return dispatch => {
      const resolve = resolvePending;
      resolvePending = null;
      dispatch({ type: ConfirmActions.CLOSE });
      if (resolve) {
        resolve(confirmed);
      }
    };
  },
};

export default ConfirmActions;
