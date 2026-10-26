import SequencesActions from 'actions/SequencesActions';

const initialState = {
  query: null,
  expandedId: null,
  performed: [],
};

function SequencesReducer(state = initialState, action) {
  switch (action.type) {
    case SequencesActions.SEARCH:
      return {
        ...state,
        query: action.query,
        expandedId: null,
      };

    case SequencesActions.TOGGLE_PREVIEW:
      return {
        ...state,
        expandedId: state.expandedId === action.id ? null : action.id,
      };

    case SequencesActions.LOADED_PERFORMED:
      return {
        ...state,
        performed: action.data,
      };

    default:
      return state;
  }
}

export default SequencesReducer;
