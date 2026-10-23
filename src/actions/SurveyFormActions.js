import Api from 'data/Api';

const SurveyFormActions = {
  LOAD: 'SurveyFormActions.LOAD',
  LOADED: 'SurveyFormActions.LOADED',

  load(id) {
    return Api.simpleGet(
      `/api/survey_forms/${id}`,
      SurveyFormActions.LOAD,
      SurveyFormActions.LOADED
    );
  },
};

export default SurveyFormActions;
