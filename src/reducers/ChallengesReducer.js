import ChallengesActions from 'actions/ChallengesActions';

// Ids dos desafios favoritos do professor, carregados depois de salvar ou
// remover um favorito. As listas marcam isSaved a partir daqui.
const initialState = {
  saved: [],
};

function ChallengesReducer(state = initialState, action) {
  switch (action.type) {
    case ChallengesActions.LOADED_SAVED:
      return {
        ...state,
        saved: action.saved,
      };

    default:
      return state;
  }
}

export default ChallengesReducer;
