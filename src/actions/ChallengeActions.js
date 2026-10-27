import SnackbarActions from 'actions/SnackbarActions';
import ChallengesActions from 'actions/ChallengesActions';
import getTeacherId from 'data/getTeacherId';
import { curriculoApi } from 'data/curriculoApi';
import { history } from 'utils/history';

// Favoritos e envio de resultado, pelas mutations do curriculoApi. Em caso de
// erro o baseQuery já mostra o alerta, então aqui o erro só interrompe o fluxo.
const { endpoints } = curriculoApi;
const ignoreError = () => {};

const ChallengeActions = {
  delete(id) {
    return dispatch =>
      dispatch(endpoints.deleteFavoriteChallenge.initiate({ teacherId: getTeacherId(), challengeId: id }))
        .unwrap()
        .then(() => {
          dispatch(SnackbarActions.open('Desafio removido'));
          dispatch(ChallengesActions.loadSaved());
        })
        .catch(ignoreError);
  },
  save(id) {
    return dispatch =>
      dispatch(endpoints.saveFavoriteChallenge.initiate({ teacherId: getTeacherId(), challengeId: id }))
        .unwrap()
        .then(() => {
          dispatch(SnackbarActions.open('Desafio salvo'));
          dispatch(ChallengesActions.loadSaved());
        })
        .catch(ignoreError);
  },
  // A mutation invalida os resultados do desafio, que recarregam na página.
  sendResult(slug, classroom, description, links, files) {
    return dispatch => {
      const body = {
        'result[class_name]': classroom,
        'result[description]': description,
        'result[links_attributes][][link]': links,
        'result[archives][]': files,
        'result[teacher_id]': getTeacherId(),
      };
      return dispatch(endpoints.sendChallengeResult.initiate({ slug, body }))
        .unwrap()
        .then(() => {
          history.back();
          dispatch(SnackbarActions.open('Desafio salvo'));
        })
        .catch(ignoreError);
    };
  },
};

export default ChallengeActions;
