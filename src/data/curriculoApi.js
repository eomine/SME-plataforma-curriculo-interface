import { createApi } from '@reduxjs/toolkit/query/react';
import { openAlert } from 'reducers/messagesSlice';
import Api from 'data/Api';

const requests = { GET: Api.get, POST: Api.post, PUT: Api.put, DELETE: Api.delete };

// Usa o data/Api das actions: mesmo token, mesmo tratamento do 401 e o mesmo
// alerta de erro. A paginação (header Link) e o total vão no meta. O
// argumento é a URL, ou { url, method, body, isJson } para as mutations (o body
// vai como FormData, ou JSON com isJson, como nas actions).
async function baseQuery(args, { dispatch }) {
  const { url, method = 'GET', body, isJson } = typeof args === 'string' ? { url: args } : args;
  try {
    const { data = null, nextPage, totalItems } = await requests[method](dispatch, url, body, isJson);
    return { data, meta: { nextPage, totalItems } };
  } catch (error) {
    dispatch(openAlert(`Ocorreu um erro: ${error}`));
    return { error: String(error) };
  }
}

// O id do professor entra no argumento das queries dele, para o cache não
// misturar dados de logins diferentes.
const teacherUrl = (teacherId, path = '') => `/api/professores/${teacherId}${path}`;

// Cada query gera um hook (useGetXQuery); componentes de classe usam
// utils/withQuery. As mutations invalidam as tags das queries afetadas.
export const curriculoApi = createApi({
  reducerPath: 'curriculoApi',
  baseQuery,
  tagTypes: ['Collections', 'Collection', 'CollectionItems', 'ItemCollections', 'Project', 'ProjectList', 'SequenceList', 'ChallengeResults', 'SurveyAnswers'],
  endpoints: build => ({
    getActivity: build.query({
      query: ({ sequenceSlug, activitySlug }) =>
        `/api/sequencias/${sequenceSlug}/atividades/${activitySlug}`,
    }),
    // Coleções do professor
    // Desafios
    getOngoingChallenges: build.query({
      query: () => '/api/desafios/andamento',
    }),
    getFinishedChallenges: build.query({
      query: () => '/api/desafios/finalizados',
    }),
    getChallenge: build.query({
      query: slug => `/api/desafios/${slug}`,
    }),
    // Resultados de um desafio, paginados pelo header Link.
    getChallengeResults: build.infiniteQuery({
      query: ({ queryArg, pageParam }) => pageParam || `/api/desafios/${queryArg}/resultados`,
      transformResponse: (items, meta) => ({
        items,
        nextPage: meta.nextPage,
        totalItems: meta.totalItems,
      }),
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextPage || undefined,
      },
      providesTags: (result, error, slug) => [{ type: 'ChallengeResults', id: slug }],
    }),
    getChallengeResult: build.query({
      query: ({ slug, id }) => `/api/desafios/${slug}/resultados/${id}`,
    }),
    sendChallengeResult: build.mutation({
      query: ({ slug, body }) => ({ url: `/api/desafios/${slug}/resultados`, method: 'POST', body }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'ChallengeResults', id: slug }],
    }),
    // Favoritos do professor. A API só tem o GET; o POST e o DELETE dão 404.
    getFavoriteChallenges: build.query({
      query: teacherId => teacherUrl(teacherId, '/favoritos'),
    }),
    saveFavoriteChallenge: build.mutation({
      query: ({ teacherId, challengeId }) => ({
        url: teacherUrl(teacherId, '/favoritos'),
        method: 'POST',
        body: { 'favourite[challenge]': challengeId },
      }),
    }),
    deleteFavoriteChallenge: build.mutation({
      query: ({ teacherId, challengeId }) => ({
        url: teacherUrl(teacherId, `/favoritos/${challengeId}`),
        method: 'DELETE',
      }),
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
      // As listas mostram "Salvo" (already_saved_in_collection) pelos itens dela.
      invalidatesTags: ['Collections', 'ItemCollections', 'SequenceList', 'ProjectList'],
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
      invalidatesTags: (result, error, { id, kind }) => [
        'Collections',
        'ItemCollections',
        { type: 'CollectionItems', id: `${kind}-${id}` },
      ],
    }),
    removeFromCollection: build.mutation({
      query: ({ teacherId, id, kind, itemId }) => ({
        url: teacherUrl(teacherId, `/colecoes/${id}/${kind === 'project' ? 'projetos' : 'sequencias'}/${itemId}`),
        method: 'DELETE',
      }),
      // Ao salvar, as listas marcam o item (markSaved); ao tirar, recarregam.
      invalidatesTags: (result, error, { id, kind }) => [
        'Collections',
        'ItemCollections',
        { type: 'CollectionItems', id: `${kind}-${id}` },
        kind === 'project' ? 'ProjectList' : 'SequenceList',
      ],
    }),
    // Sequência e projeto
    getSequence: build.query({
      query: slug => `/api/sequencias/${slug}`,
    }),
    getProject: build.query({
      query: slug => `/api/projects/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Project', id: slug }],
    }),
    // Formulário de projeto: o projeto a editar, opções, objetivos de
    // aprendizagem e escolas. O projeto da edição é separado do getProject e
    // sem tag: ao salvar, a invalidação do Project não refaz a busca na página
    // de edição ainda aberta (o slug pode ter mudado com o título).
    getProjectToEdit: build.query({
      query: slug => `/api/projects/${slug}`,
    }),
    getProjectOptions: build.query({
      query: () => '/api/project_select_options',
      transformResponse: data => ({
        curricularComponents: data.curricular_components.filter(cc => cc.name !== 'Trilhas de Aprendizagens'),
        knowledgeMatrices: data.knowledge_matrices,
        studentProtagonisms: data.student_protagonisms,
        segments: data.segments,
        stages: data.stages,
        years: data.years,
        dres: data.regional_education_boards,
      }),
    }),
    // Mesma query string das actions antigas (começa com &).
    getLearningObjectives: build.query({
      query: ({ curricularComponentIds, yearIds }) =>
        '/api/learning_objectives?' +
        curricularComponentIds.map(id => `&curricular_component_ids[]=${id}`).join('') +
        yearIds.map(id => `&year_ids[]=${id}`).join(''),
    }),
    getSchools: build.query({
      query: regionalEducationBoardId => `/api/schools?regional_education_board_id=${regionalEducationBoardId}`,
    }),
    createProject: build.mutation({
      query: project => ({ url: '/api/projects', method: 'POST', body: project }),
      invalidatesTags: ['ProjectList'],
    }),
    updateProject: build.mutation({
      query: ({ slug, project }) => ({ url: `/api/projects/${slug}`, method: 'PUT', body: project }),
      invalidatesTags: (result, error, { slug }) => ['ProjectList', { type: 'Project', id: slug }],
    }),
    // Coleções do professor em que a sequência está (o "Salvo" da página). O
    // teacherId fica no argumento só para separar o cache por login.
    getSequenceCollections: build.query({
      query: ({ slug }) => `/api/sequencias/${slug}/colecoes`,
      providesTags: ['ItemCollections'],
    }),
    // Sequências realizadas pelo professor logado (o argumento é o teacherId).
    // "Meus projetos" do perfil
    getMyProjects: build.query({
      query: teacherId => teacherUrl(teacherId, '/meus_projetos'),
    }),
    getPerformedSequences: build.query({
      query: () => '/api/sequencias_realizadas',
    }),
    // Comentários de projeto; recarregam o projeto depois de gravados.
    createComment: build.mutation({
      query: ({ comment }) => ({ url: '/api/comments', method: 'POST', body: comment, isJson: true }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Project', id: slug }],
    }),
    deleteComment: build.mutation({
      query: ({ id }) => ({ url: `/api/comments/${id}`, method: 'DELETE', body: { id }, isJson: true }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Project', id: slug }],
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
    // Lista paginada de projetos, como a de sequências. As listas dependem do
    // login (already_saved_in_collection) e recarregam quando ele muda.
    getProjects: build.infiniteQuery({
      providesTags: ['ProjectList'],
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
    // Avaliação de uma sequência realizada. Recarrega as sequências das
    // coleções, que mostram "Avaliar" ou "Ver avaliação".
    saveSequenceRating: build.mutation({
      query: ({ slug, rating }) => ({ url: `/api/sequencias/${slug}/avaliacao`, method: 'POST', body: rating, isJson: true }),
      invalidatesTags: ['CollectionItems'],
    }),
    getRatingCriteria: build.query({
      query: () => '/api/avaliacao_criterios',
      transformResponse: criteria =>
        [...criteria].sort((a, b) => (a.sequence < b.sequence ? -1 : a.sequence > b.sequence ? 1 : 0)),
    }),
    getSurveyForm: build.query({
      query: id => `/api/survey_forms/${id}`,
    }),
    // A resposta do professor ao formulário: a já salva (rascunho ou
    // finalizada) ou uma nova, com uma resposta vazia por questão. Sem tag: o
    // formulário a busca de novo sempre que abre, e salvar sai da página.
    getSurveyFormAnswer: build.query({
      query: ({ teacherId, surveyFormId }) =>
        `/api/survey_form_answers/new?teacher_id=${teacherId}&survey_form_id=${surveyFormId}`,
    }),
    // Ids dos formulários que o professor já finalizou
    getFinishedSurveyForms: build.query({
      query: teacherId => teacherUrl(teacherId, '/todas_respostas'),
      providesTags: ['SurveyAnswers'],
    }),
    saveSurveyFormAnswer: build.mutation({
      query: surveyFormAnswer => ({ url: '/api/survey_form_answers', method: 'POST', body: surveyFormAnswer, isJson: true }),
      invalidatesTags: ['SurveyAnswers'],
    }),
    // Lista paginada: o argumento é a query string da busca ('' = todas) e
    // cada página seguinte vem da URL do header Link da anterior.
    getSequences: build.infiniteQuery({
      providesTags: ['SequenceList'],
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
  useGetChallengeQuery,
  useGetChallengeResultQuery,
  useGetChallengeResultsInfiniteQuery,
  useGetCollectionQuery,
  useGetCollectionProjectsQuery,
  useGetCollectionSequencesQuery,
  useGetCollectionsQuery,
  useGetConsultationsQuery,
  useGetConsultationQuery,
  useGetFinishedChallengesQuery,
  useGetKnowledgeMatricesQuery,
  useGetMethodologiesQuery,
  useGetMyProjectsQuery,
  useGetMethodologyQuery,
  useGetOngoingChallengesQuery,
  useGetPerformedSequencesQuery,
  useGetLearningObjectivesQuery,
  useGetProjectOptionsQuery,
  useGetProjectQuery,
  useGetProjectToEditQuery,
  useGetSchoolsQuery,
  useGetProjectsInfiniteQuery,
  useGetRatingCriteriaQuery,
  useGetSequenceCollectionsQuery,
  useGetSequenceQuery,
  useGetSequencesInfiniteQuery,
  useGetFinishedSurveyFormsQuery,
  useGetSurveyFormAnswerQuery,
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
