import { createApi } from '@reduxjs/toolkit/query/react';
import AlertActions from 'actions/AlertActions';
import Api from 'data/Api';

const requests = { GET: Api.get, POST: Api.post, PUT: Api.put, DELETE: Api.delete };

// Usa o data/Api das actions: mesmo token, mesmo tratamento do 401 e o mesmo
// alerta de erro. A paginação (header Link) e o total vão no meta. O
// argumento é a URL, ou { url, method, body } para as mutations (o body vai
// como FormData, como nas actions).
async function baseQuery(args, { dispatch }) {
  const { url, method = 'GET', body } = typeof args === 'string' ? { url: args } : args;
  try {
    const { data = null, nextPage, totalItems } = await requests[method](dispatch, url, body);
    return { data, meta: { nextPage, totalItems } };
  } catch (error) {
    dispatch(AlertActions.open(`Ocorreu um erro: ${error}`));
    return { error: String(error) };
  }
}

// O id do professor entra no argumento das queries dele, para o cache não
// misturar dados de logins diferentes.
const teacherUrl = (teacherId, path = '') => `/api/professores/${teacherId}${path}`;

export const curriculoApi = createApi({
  reducerPath: 'curriculoApi',
  baseQuery,
  endpoints: build => ({
    getActivity: build.query({
      query: ({ sequenceSlug, activitySlug }) =>
        `/api/sequencias/${sequenceSlug}/atividades/${activitySlug}`,
    }),
    // Coleções do professor
    getCollections: build.query({
      query: teacherId => teacherUrl(teacherId, '/colecoes'),
      providesTags: ['Collections'],
    }),
    getCollection: build.query({
      query: ({ teacherId, id }) => teacherUrl(teacherId, `/colecoes/${id}`),
      providesTags: (result, error, { id }) => [{ type: 'Collection', id }],
    }),
    getCollectionSequences: build.query({
      query: ({ teacherId, id }) => teacherUrl(teacherId, `/colecoes/${id}/sequencias`),
      providesTags: (result, error, { id }) => [{ type: 'CollectionItems', id: `sequence-${id}` }],
    }),
    getCollectionProjects: build.query({
      query: ({ teacherId, id }) => teacherUrl(teacherId, `/colecoes/${id}/projetos`),
      providesTags: (result, error, { id }) => [{ type: 'CollectionItems', id: `project-${id}` }],
    }),
    createCollection: build.mutation({
      query: ({ teacherId, name }) => ({
        url: teacherUrl(teacherId, '/colecoes'),
        method: 'POST',
        body: { 'collection[name]': name },
      }),
      invalidatesTags: ['Collections'],
    }),
    editCollection: build.mutation({
      query: ({ teacherId, id, name }) => ({
        url: teacherUrl(teacherId, `/colecoes/${id}`),
        method: 'PUT',
        body: { 'collection[name]': name },
      }),
      invalidatesTags: (result, error, { id }) => ['Collections', { type: 'Collection', id }],
    }),
    deleteCollection: build.mutation({
      query: ({ teacherId, id }) => ({ url: teacherUrl(teacherId, `/colecoes/${id}`), method: 'DELETE' }),
      invalidatesTags: ['Collections'],
    }),
    // Os contadores da lista de coleções também mudam.
    addToCollection: build.mutation({
      query: ({ teacherId, id, kind, itemId }) => ({
        url: teacherUrl(teacherId, `/colecoes/${id}/${kind === 'project' ? 'projetos' : 'sequencias'}`),
        method: 'POST',
        body: kind === 'project'
          ? { 'collection_project[project_id]': itemId }
          : { 'collection_activity_sequence[activity_sequence_id]': itemId },
      }),
      invalidatesTags: (result, error, { id, kind }) => ['Collections', { type: 'CollectionItems', id: `${kind}-${id}` }],
    }),
    removeFromCollection: build.mutation({
      query: ({ teacherId, id, kind, itemId }) => ({
        url: teacherUrl(teacherId, `/colecoes/${id}/${kind === 'project' ? 'projetos' : 'sequencias'}/${itemId}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, kind }) => ['Collections', { type: 'CollectionItems', id: `${kind}-${id}` }],
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
    // Lista paginada de projetos, como a de sequências.
    getProjects: build.infiniteQuery({
      query: ({ queryArg, pageParam }) =>
        pageParam || (queryArg ? `/api/projects?${queryArg}` : '/api/projects'),
      transformResponse: (items, meta) => ({
        items,
        nextPage: meta.nextPage,
        totalItems: meta.totalItems,
      }),
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextPage || undefined,
      },
    }),
    getRatingCriteria: build.query({
      query: () => '/api/avaliacao_criterios',
      transformResponse: criteria =>
        [...criteria].sort((a, b) => (a.sequence < b.sequence ? -1 : a.sequence > b.sequence ? 1 : 0)),
    }),
    getSurveyForm: build.query({
      query: id => `/api/survey_forms/${id}`,
    }),
    // Lista paginada: o argumento é a query string da busca ('' = todas) e
    // cada página seguinte vem da URL do header Link da anterior.
    getSequences: build.infiniteQuery({
      query: ({ queryArg, pageParam }) =>
        pageParam || (queryArg ? `/api/sequencias?${queryArg}` : '/api/sequencias'),
      transformResponse: (items, meta) => ({
        items,
        nextPage: meta.nextPage,
        totalItems: meta.totalItems,
      }),
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextPage || undefined,
      },
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
  useGetCollectionQuery,
  useGetCollectionProjectsQuery,
  useGetCollectionSequencesQuery,
  useGetCollectionsQuery,
  useGetConsultationsQuery,
  useGetConsultationQuery,
  useGetKnowledgeMatricesQuery,
  useGetMethodologiesQuery,
  useGetMethodologyQuery,
  useGetProjectsInfiniteQuery,
  useGetRatingCriteriaQuery,
  useGetSequencesInfiniteQuery,
  useGetSurveyFormQuery,
  useGetSustainableDevGoalsQuery,
  useGetSustainableDevGoalQuery,
} = curriculoApi;

// Marca o item como salvo em todas as buscas da lista já em cache, como os
// reducers faziam com o SAVED_SEQUENCE e o SAVED_PROJECT.
function markSaved(endpointName, id) {
  return (dispatch, getState) => {
    curriculoApi.util.selectCachedArgsForQuery(getState(), endpointName).forEach(queryArg => {
      dispatch(
        curriculoApi.util.updateQueryData(endpointName, queryArg, draft => {
          draft.pages.forEach(page => {
            page.items.forEach(item => {
              if (item.id === id) {
                item.isSaved = true;
              }
            });
          });
        })
      );
    });
  };
}

export const markSequenceSaved = sequenceId => markSaved('getSequences', sequenceId);
export const markProjectSaved = projectId => markSaved('getProjects', projectId);
