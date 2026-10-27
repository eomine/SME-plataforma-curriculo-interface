import AlertActions from 'actions/AlertActions';
import { curriculoApi } from 'data/curriculoApi';
import { history } from 'utils/history';

// O projeto e as opções do formulário vêm de data/projectFormQueries.
const EditProjectActions = {
  update(project, slug) {
    return dispatch =>
      dispatch(curriculoApi.endpoints.updateProject.initiate({ slug, project }))
        .unwrap()
        .then(() => {
          dispatch(AlertActions.open(`Projeto atualizado com sucesso.`));
          history.push(`/perfil`);
        })
        // O erro já foi mostrado no alerta do curriculoApi.
        .catch(() => {});
  },
};

export default EditProjectActions;
