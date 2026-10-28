import { openAlert } from 'reducers/messagesSlice';
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
          dispatch(openAlert(`Resposta salva com sucesso.`));
          history.push(`/consultas-publicas`);
        })
        // O erro já foi mostrado no alerta do curriculoApi.
        .catch(() => {});
  },
  alertError(error) {
    return dispatch => {
      return dispatch(openAlert(`Ocorreu um erro: ${error}`))
    };
  },
};

export default TeacherSurveyFormsActions;
