import { openAlert } from 'reducers/messagesSlice';
import { curriculoApi, runMutation } from 'data/curriculoApi';
import { history } from 'utils/history';

// As opções do formulário vêm de data/projectFormQueries.
const CreateProjectActions = {
  create(project) {
    return dispatch =>
      runMutation(dispatch, curriculoApi.endpoints.createProject, project)
        .then(() => {
          dispatch(openAlert(`Projeto salvo com sucesso.`));
          history.push(`/perfil`);
        })
        // O erro já foi mostrado no alerta do curriculoApi.
        .catch(() => {});
  },
  unauthorizedUser() {
    return dispatch => {
      dispatch(openAlert(`Você precisa efetuar login para acessar essa página.`));
      history.push(`/`);
    };
  },
  blockedUser() {
    return dispatch => {
      dispatch(openAlert(`Você está bloquado e não pode criar projetos no momento. Entre em contato com a Secretaria Municipal de Educação.`));
      history.push(`/`);
    };
  },
};

export default CreateProjectActions;
