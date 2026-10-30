import { openAlert } from 'reducers/messagesSlice';
import { curriculoApi, runMutation } from 'data/curriculoApi';
import { history } from 'utils/history';

// O projeto e as opções do formulário vêm de data/projectFormQueries.
const EditProjectActions = {
  update(project, slug) {
    return dispatch =>
      runMutation(dispatch, curriculoApi.endpoints.updateProject, { slug, project })
        .then(() => {
          dispatch(openAlert(`Projeto atualizado com sucesso.`));
          history.push(`/perfil`);
        })
        // O erro já foi mostrado no alerta do curriculoApi.
        .catch(() => {});
  },
};

export default EditProjectActions;
