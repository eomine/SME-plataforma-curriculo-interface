import BodyActions from 'actions/BodyActions';
import LearningObjectivesActions from 'actions/LearningObjectivesActions';

const initialState = {
  hasMobileMenu: false,
  isLoading: false,
};

function BodyReducer(state = initialState, action) {
  switch (action.type) {
    case BodyActions.HIDE_LOADING:
    case LearningObjectivesActions.LOADED:
      return {
        ...state,
        isLoading: false,
      };

    case BodyActions.SHOW_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case BodyActions.HIDE_MOBILE_MENU:
      return {
        ...state,
        hasMobileMenu: false,
        hasModal: false,
      };

    case BodyActions.SHOW_MOBILE_MENU:
      return {
        ...state,
        hasMobileMenu: true,
        hasModal: true,
      };

    default:
      return state;
  }
}

export default BodyReducer;
