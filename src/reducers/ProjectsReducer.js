import ProjectsActions from 'actions/ProjectsActions';

const initialState = {
  // Busca atual e prévia expandida da lista pública (data/curriculoApi).
  query: null,
  expandedId: null,
};

function ProjectsReducer(state = initialState, action) {
  switch (action.type) {
    case ProjectsActions.SEARCH:
      return {
        ...state,
        query: action.query,
        expandedId: null,
      };

    case ProjectsActions.TOGGLE_PREVIEW:
      return {
        ...state,
        expandedId: state.expandedId === action.id ? null : action.id,
      };

    default:
      return state;
  }
}

export default ProjectsReducer;
