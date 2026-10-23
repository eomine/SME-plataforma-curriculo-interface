import Api from 'data/Api';

const ConsultationsActions = {
  LOAD: 'ConsultationsActions.LOAD',
  LOADED: 'ConsultationsActions.LOADED',

  load() {
    return Api.simpleGet(
      '/api/public_consultations',
      ConsultationsActions.LOAD,
      ConsultationsActions.LOADED
    );
  },
};

export default ConsultationsActions;
