import { createSlice } from '@reduxjs/toolkit';
import Api from 'data/Api';
import getFiltersQueryString from 'data/getFiltersQueryString';
import { openAlert } from 'reducers/messagesSlice';

// Painel de filtros das listas de sequências e de projetos. As duas usam o
// mesmo slice (createFiltersSlice), cada uma com o seu pedaço do state.
//
// Os filtros vêm de /api/filtros e ficam numa lista só, cada um com `type`
// (segments, stages, years, curricular_components...) e `isActive`. Escolher
// um segmento recarrega as etapas; uma etapa, os anos; um ano ou componente,
// os filtros extras (objetivos de aprendizagem e eixos).

const isYearOrComponent = type => type === 'years' || type === 'curricular_components';
const sameFilter = (a, b) => a.type === b.type && a.id === b.id;
const nameOf = item => item.name || item.title || item.description;

// Monta a lista a partir da resposta da API, nas chaves `types`.
function buildFilters(data, types, isActive) {
  const result = [];
  types.forEach(type => {
    (data[type] || []).forEach(item => {
      result.push({ ...item, isActive: isActive(item, type), type });
    });
  });
  return result;
}

function createFiltersSlice(name, types) {
  // Na primeira carga, só o filtro guardado por cacheFilter começa ativo.
  const isCached = state => (item, type) =>
    !!state.cachedFilter && state.cachedFilter.type === type && state.cachedFilter.id === item.id;

  const slice = createSlice({
    name,
    initialState: {
      currCategory: null,
      cachedFilter: null,
      filters: [],
      filtersExtra: [],
      isExpanded: false,
      isShowingCategory: false,
      order: 'default',
      query: '',
    },
    reducers: {
      loaded(state, action) {
        state.filters = buildFilters(action.payload, types, isCached(state));
      },
      // Etapas ou anos recarregados: mantém ativos os que já estavam.
      reloaded(state, action) {
        const wasActive = (item, type) =>
          state.filters.some(entry => entry.isActive && entry.id === item.id && entry.type === type);
        state.filters = buildFilters(action.payload, types, wasActive);
      },
      extraLoaded(state, action) {
        state.filtersExtra = buildFilters(action.payload, ['learning_objectives', 'axes'], isCached(state));
      },
      hideCategory(state) {
        state.isShowingCategory = false;
      },
      categoryShown(state, action) {
        state.isShowingCategory = true;
        state.currCategory = action.payload;
      },
      clearFilters(state) {
        state.isExpanded = false;
        state.cachedFilter = null;
        state.filters.forEach(item => { item.isActive = false; });
        state.filtersExtra.forEach(item => { item.isActive = false; });
        state.query = '';
      },
      deactivate(state, action) {
        const item = state.filters.find(entry => sameFilter(entry, action.payload));
        if (item) {
          item.isActive = false;
        }
      },
      cacheFilter(state, action) {
        state.cachedFilter = action.payload;
      },
      // Compara pelo tipo e pelo nome, como antes.
      toggled(state, action) {
        const filter = action.payload;
        state.filters.concat(state.filtersExtra).forEach(item => {
          if (item.type === filter.type && nameOf(item) === nameOf(filter)) {
            item.isActive = !item.isActive;
          }
        });
      },
      togglePanel(state) {
        state.isExpanded = !state.isExpanded;
      },
      search(state) {
        state.isExpanded = false;
      },
      setOrder(state, action) {
        state.order = action.payload;
      },
      setQuery(state, action) {
        state.query = action.payload;
      },
    },
  });

  const { loaded, reloaded, extraLoaded, categoryShown, deactivate, toggled } = slice.actions;
  const select = getState => getState()[name];
  const fetchFilters = (dispatch, queryString = '') =>
    Api.get(dispatch, queryString ? `/api/filtros?${queryString}` : '/api/filtros').then(response => response.data);

  // Só um segmento (ou etapa) ativo por vez: desativa o outro antes.
  const toggleSingle = type => filter => (dispatch, getState) => {
    const other = select(getState).filters.find(
      item => !sameFilter(item, filter) && item.type === type && item.isActive
    );
    if (other) {
      dispatch(deactivate(other));
    }
    dispatch(toggled(filter));
  };

  const actions = {
    hideCategory: slice.actions.hideCategory,
    clearFilters: slice.actions.clearFilters,
    cacheFilter: slice.actions.cacheFilter,
    togglePanel: slice.actions.togglePanel,
    search: slice.actions.search,
    setOrder: slice.actions.setOrder,
    setQuery: slice.actions.setQuery,

    load() {
      return dispatch =>
        fetchFilters(dispatch)
          .then(data => dispatch(loaded(data)))
          .catch(error => dispatch(openAlert(`Ocorreu um erro: ${error}`)));
    },
    toggleSegments: toggleSingle('segments'),
    toggleStages: toggleSingle('stages'),
    getStages(filter) {
      return dispatch =>
        fetchFilters(dispatch, filter.isActive ? `segment_id[]=${filter.id}` : '').then(data =>
          dispatch(reloaded(data))
        );
    },
    getYears(filter) {
      return (dispatch, getState) => {
        const segment = select(getState).filters.find(item => item.type === 'segments' && item.isActive);
        const queryString = filter.isActive ? `stage_id[]=${filter.id}&segment_id[]=${segment.id}` : '';
        return fetchFilters(dispatch, queryString).then(data => dispatch(reloaded(data)));
      };
    },
    // Objetivos de aprendizagem e eixos dependem de um ano ou componente.
    showCategory(category) {
      return (dispatch, getState) => {
        const hasYearOrComponent = select(getState).filters.some(
          item => isYearOrComponent(item.type) && item.isActive
        );
        if (!hasYearOrComponent && (category.slug === 'axes' || category.slug === 'learning_objectives')) {
          dispatch(openAlert('Selecione uma etapa ou componente curricular.'));
        } else {
          dispatch(categoryShown(category));
        }
      };
    },
    toggleFilter(filter) {
      return (dispatch, getState) => {
        dispatch(toggled(filter));
        if (isYearOrComponent(filter.type)) {
          const filters = select(getState).filters.filter(item => isYearOrComponent(item.type) && item.isActive);
          return fetchFilters(dispatch, getFiltersQueryString(filters)).then(data => dispatch(extraLoaded(data)));
        }
      };
    },
    // Usado pelos chips: muda o filtro e recarrega o que depende dele.
    toggleFilterAndSearch(filter) {
      return (dispatch, getState) => {
        dispatch(toggled(filter));
        const queryString = getFiltersQueryString(select(getState).filters.filter(item => item.isActive));
        if (filter.type === 'segments' || filter.type === 'stages') {
          fetchFilters(dispatch, queryString).then(data => dispatch(reloaded(data)));
        }
        if (isYearOrComponent(filter.type)) {
          fetchFilters(dispatch, queryString).then(data => dispatch(extraLoaded(data)));
        }
      };
    },
  };

  return { reducer: slice.reducer, actions };
}

const sequenceFilters = createFiltersSlice('sequenceFilters', [
  'segments',
  'stages',
  'years',
  'curricular_components',
  'sustainable_development_goals',
  'knowledge_matrices',
  'activity_types',
]);

const projectFilters = createFiltersSlice('projectFilters', [
  'segments',
  'stages',
  'years',
  'curricular_components',
  'sustainable_development_goals',
  'knowledge_matrices',
  'activity_types',
  'regional_education_boards',
]);

export const sequenceFiltersActions = sequenceFilters.actions;
export const sequenceFiltersReducer = sequenceFilters.reducer;
export const projectFiltersActions = projectFilters.actions;
export const projectFiltersReducer = projectFilters.reducer;
