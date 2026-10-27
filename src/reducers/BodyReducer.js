import BodyActions from 'actions/BodyActions';
import ChallengeActions from 'actions/ChallengeActions';
import ChallengesActions from 'actions/ChallengesActions';
import LearningObjectivesActions from 'actions/LearningObjectivesActions';
import SequenceActions from 'actions/SequenceActions';
import CreateProjectActions from 'actions/CreateProjectActions';
import EditProjectActions from 'actions/EditProjectActions';
import ProjectsActions from 'actions/ProjectsActions';
import ProjectActions from 'actions/ProjectActions';

const initialState = {
  hasMobileMenu: false,
  isLoading: false,
};

function BodyReducer(state = initialState, action) {
  switch (action.type) {
    case BodyActions.HIDE_LOADING:
    case ChallengeActions.LOADED:
    case ChallengesActions.LOADED:
    case LearningObjectivesActions.LOADED:
    case SequenceActions.LOADED:
    case ProjectActions.LOADED:
    case ProjectsActions.LOADED:
    case CreateProjectActions.LOADED:
    case EditProjectActions.LOADED:
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
