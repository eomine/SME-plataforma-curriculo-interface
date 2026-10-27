import AlertActions from './AlertActions';
import { curriculoApi } from 'data/curriculoApi';
import { history } from 'utils/history';

// A resposta e os formulários finalizados vêm do curriculoApi
// (getSurveyFormAnswer, getFinishedSurveyForms).
const TeacherSurveyFormsActions = {
  create(surveyFormAnswer) {
    return dispatch =>
      dispatch(curriculoApi.endpoints.saveSurveyFormAnswer.initiate(surveyFormAnswer))
        .unwrap()
        .then(() => {
          dispatch(AlertActions.open(`Resposta salva com sucesso.`));
          history.push(`/consultas-publicas`);
        })
        // O erro já foi mostrado no alerta do curriculoApi.
        .catch(() => {});
  },
  alertError(error) {
    return dispatch => {
      return dispatch(AlertActions.open(`Ocorreu um erro: ${error}`))
    };
  },
};

export default TeacherSurveyFormsActions;
