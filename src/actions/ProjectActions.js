import { openAlert } from 'reducers/messagesSlice';
import { showLoading, hideLoading } from 'reducers/bodySlice';
import { curriculoApi } from 'data/curriculoApi';

// Comentários de projeto, pelas mutations do curriculoApi (que recarregam o
// projeto quando terminam). Em caso de erro o baseQuery já mostra o alerta.
function runComment(dispatch, endpoint, args, successMessage) {
  dispatch(showLoading());
  return dispatch(endpoint.initiate(args))
    .unwrap()
    .then(() => dispatch(openAlert(successMessage)))
    .catch(() => {})
    .finally(() => dispatch(hideLoading()));
}

const ProjectActions = {
  createComment(comment, slug) {
    return dispatch =>
      runComment(dispatch, curriculoApi.endpoints.createComment, { comment, slug }, 'Comentário salvo com sucesso.');
  },
  deleteComment(id, slug) {
    return dispatch =>
      runComment(dispatch, curriculoApi.endpoints.deleteComment, { id, slug }, 'Comentário apagado com sucesso.');
  },
};

export default ProjectActions;
