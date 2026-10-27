import React from 'react';
import AlertActions from './AlertActions';
import SnackbarActions from './SnackbarActions';
import getTeacherId from 'data/getTeacherId';
import { curriculoApi, markProjectSaved, markSequenceSaved } from 'data/curriculoApi';
import { history } from 'utils/history';

// As coleções ficam no cache do curriculoApi; estas actions chamam as
// mutations dele e cuidam do resto (snackbar, navegação, alertas). Em caso de
// erro o baseQuery já mostra o alerta, então aqui o erro só interrompe o fluxo.
const { endpoints } = curriculoApi;
const run = (dispatch, endpoint, args) =>
  dispatch(endpoint.initiate({ teacherId: getTeacherId(), ...args })).unwrap();
const ignoreError = () => {};

function savedSnackbar(dispatch, name) {
  dispatch(
    SnackbarActions.open(
      <span>
        Salvo em <strong>{name}</strong>
      </span>
    )
  );
}

function doSaveSequence(dispatch, id, name, sequenceId) {
  return run(dispatch, endpoints.addToCollection, { id, kind: 'sequence', itemId: sequenceId })
    .then(() => {
      dispatch({ sequenceId, type: CollectionActions.SAVED_SEQUENCE });
      dispatch(markSequenceSaved(sequenceId));
      savedSnackbar(dispatch, name);
    })
    .catch(ignoreError);
}

function doSaveProject(dispatch, id, name, projectId) {
  return run(dispatch, endpoints.addToCollection, { id, kind: 'project', itemId: projectId })
    .then(() => {
      dispatch({ projectId, type: CollectionActions.SAVED_PROJECT });
      dispatch(markProjectSaved(projectId));
      savedSnackbar(dispatch, name);
    })
    .catch(ignoreError);
}

const CollectionActions = {
  SAVED_SEQUENCE: 'CollectionActions.SAVED_SEQUENCE',
  SAVED_PROJECT: 'CollectionActions.SAVED_PROJECT',

  removeSequence(id, sequenceId) {
    return dispatch =>
      run(dispatch, endpoints.removeFromCollection, { id, kind: 'sequence', itemId: sequenceId }).catch(ignoreError);
  },
  saveSequence(id, name, sequenceId) {
    return dispatch => doSaveSequence(dispatch, id, name, sequenceId);
  },
  removeProject(id, projectId) {
    return dispatch =>
      run(dispatch, endpoints.removeFromCollection, { id, kind: 'project', itemId: projectId }).catch(ignoreError);
  },
  saveProject(id, name, projectId) {
    return dispatch => doSaveProject(dispatch, id, name, projectId);
  },
  create(name) {
    return dispatch =>
      run(dispatch, endpoints.createCollection, { name })
        .then(data => history.push(`/colecao/${data.id}`))
        .catch(ignoreError);
  },
  createAndSaveSequence(name, sequenceId) {
    return dispatch =>
      run(dispatch, endpoints.createCollection, { name })
        .then(data => doSaveSequence(dispatch, data.id, name, sequenceId))
        .catch(ignoreError);
  },
  delete(id) {
    return dispatch =>
      run(dispatch, endpoints.deleteCollection, { id })
        .then(() => dispatch(AlertActions.open('Coleção excluída com sucesso!')))
        .catch(ignoreError);
  },
  edit(id, name) {
    return dispatch =>
      run(dispatch, endpoints.editCollection, { id, name })
        .then(() => dispatch(AlertActions.open('Coleção salva com sucesso!')))
        .catch(ignoreError);
  },
};

export default CollectionActions;
