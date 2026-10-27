import CollectionActions from 'actions/CollectionActions';

// Projetos salvos numa coleção nesta sessão: a página do projeto mostra
// "Salvo" para eles (ela não carrega em quais coleções o projeto está).
const initialState = {
  savedIds: [],
};

function ProjectReducer(state = initialState, action) {
  switch (action.type) {
    case CollectionActions.SAVED_PROJECT:
      return {
        ...state,
        savedIds: state.savedIds.concat(action.projectId),
      };

    default:
      return state;
  }
}

export default ProjectReducer;
