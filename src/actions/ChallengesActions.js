import getTeacherId from 'data/getTeacherId';
import { curriculoApi } from 'data/curriculoApi';

// As listas de desafios vêm do curriculoApi. Os favoritos só são carregados
// depois de salvar ou remover um (como antes; veja o ChallengesReducer).
const ChallengesActions = {
  LOADED_SAVED: 'ChallengesActions.LOADED_SAVED',

  loadSaved() {
    return dispatch =>
      dispatch(curriculoApi.endpoints.getFavoriteChallenges.initiate(getTeacherId(), { subscribe: false, forceRefetch: true }))
        .unwrap()
        .then(data => dispatch({ type: ChallengesActions.LOADED_SAVED, saved: (data && data.challenges) || [] }))
        .catch(() => {});
  },
};

export default ChallengesActions;
