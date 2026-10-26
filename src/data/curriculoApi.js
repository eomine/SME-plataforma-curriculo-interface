import { createApi } from '@reduxjs/toolkit/query/react';
import AlertActions from 'actions/AlertActions';
import Api from 'data/Api';

// Usa o Api.get das actions: mesmo token, mesmo tratamento do 401 e o mesmo
// alerta de erro. A paginação (header Link) e o total vão no meta.
async function baseQuery(url, { dispatch }) {
  try {
    const { data = null, nextPage, totalItems } = await Api.get(dispatch, url);
    return { data, meta: { nextPage, totalItems } };
  } catch (error) {
    dispatch(AlertActions.open(`Ocorreu um erro: ${error}`));
    return { error: String(error) };
  }
}

// Dados que só são carregados e exibidos. Cada endpoint gera um hook
// (useGetXQuery); componentes de classe usam utils/withQuery.
export const curriculoApi = createApi({
  reducerPath: 'curriculoApi',
  baseQuery,
  endpoints: build => ({
    getActivity: build.query({
      query: ({ sequenceSlug, activitySlug }) =>
        `/api/sequencias/${sequenceSlug}/atividades/${activitySlug}`,
    }),
    getConsultations: build.query({
      query: () => '/api/public_consultations',
    }),
    getConsultation: build.query({
      query: id => `/api/public_consultations/${id}`,
    }),
    getKnowledgeMatrices: build.query({
      query: () => '/api/saberes',
    }),
    getMethodologies: build.query({
      query: () => '/api/metodos/',
    }),
    getMethodology: build.query({
      query: slug => `/api/metodos/${slug}`,
    }),
    getRatingCriteria: build.query({
      query: () => '/api/avaliacao_criterios',
      transformResponse: criteria =>
        [...criteria].sort((a, b) => (a.sequence < b.sequence ? -1 : a.sequence > b.sequence ? 1 : 0)),
    }),
    getSurveyForm: build.query({
      query: id => `/api/survey_forms/${id}`,
    }),
    getSustainableDevGoals: build.query({
      query: () => '/api/ods',
    }),
    getSustainableDevGoal: build.query({
      query: id => `/api/ods/${id}`,
    }),
  }),
});

export const {
  useGetActivityQuery,
  useGetConsultationsQuery,
  useGetConsultationQuery,
  useGetKnowledgeMatricesQuery,
  useGetMethodologiesQuery,
  useGetMethodologyQuery,
  useGetRatingCriteriaQuery,
  useGetSurveyFormQuery,
  useGetSustainableDevGoalsQuery,
  useGetSustainableDevGoalQuery,
} = curriculoApi;
