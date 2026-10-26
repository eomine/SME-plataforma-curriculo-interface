import HomeActions from 'actions/HomeActions';

const initialState = {
  expandedId: null,
};

function HomeReducer(state = initialState, action) {
  switch (action.type) {
    case HomeActions.TOGGLE_PREVIEW:
      return {
        ...state,
        expandedId: state.expandedId === action.id ? null : action.id,
      };

    default:
      return state;
  }
}

export default HomeReducer;
