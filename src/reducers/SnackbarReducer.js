import SnackbarActions from 'actions/SnackbarActions';

const initialState = {
  isOpened: false,
  message: '',
  highlight: null,
};

function SnackbarReducer(state = initialState, action) {
  switch (action.type) {
    case SnackbarActions.CLOSE:
      return initialState;

    case SnackbarActions.OPEN:
      return {
        ...state,
        isOpened: true,
        message: action.message,
        highlight: action.highlight,
      };

    default:
      return state;
  }
}

export default SnackbarReducer;
