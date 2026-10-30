import { openSnackbar } from 'reducers/messagesSlice';
import { loadSavedChallenges } from 'reducers/challengesSlice';
import getTeacherId from 'data/getTeacherId';
import { curriculoApi, runMutation } from 'data/curriculoApi';
import { history } from 'utils/history';

// Favoritos e envio de resultado, pelas mutations do curriculoApi. Em caso de
// erro o baseQuery já mostra o alerta, então aqui o erro só interrompe o fluxo.
const { endpoints } = curriculoApi;
const ignoreError = () => {};

const ChallengeActions = {
  delete(id) {
    return dispatch =>
      runMutation(dispatch, endpoints.deleteFavoriteChallenge, { teacherId: getTeacherId(), challengeId: id })
        .then(() => {
          dispatch(openSnackbar('Desafio removido'));
          dispatch(loadSavedChallenges());
        })
        .catch(ignoreError);
  },
  save(id) {
    return dispatch =>
      runMutation(dispatch, endpoints.saveFavoriteChallenge, { teacherId: getTeacherId(), challengeId: id })
        .then(() => {
          dispatch(openSnackbar('Desafio salvo'));
          dispatch(loadSavedChallenges());
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
      return runMutation(dispatch, endpoints.sendChallengeResult, { slug, body })
        .then(() => {
          history.back();
          dispatch(openSnackbar('Desafio salvo'));
        })
        .catch(ignoreError);
    };
  },
};

export default ChallengeActions;
