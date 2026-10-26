import CollectionActions from 'actions/CollectionActions';
import ProjectsActions from 'actions/ProjectsActions';

const initialState = {
  // Busca atual e prévia expandida da lista pública (data/curriculoApi).
  query: null,
  expandedId: null,
  // "Meus projetos" do perfil.
  items: [],
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

    case ProjectsActions.LOADED:
      return {
        ...state,
        items: action.data,
      };

    case CollectionActions.SAVED_PROJECT:
      return {
        ...state,
        items: state.items.map(item => {
          return {
            ...item,
            isSaved: item.id === action.projectId || item.isSaved,
          };
        }),
      };

    default:
      return state;
  }
}

export default ProjectsReducer;
