import Api from 'data/Api';
import getFiltersQueryString, {
  getSearchQueryString,
} from 'data/getFiltersQueryString';

// A lista de sequências vem do curriculoApi (getSequences); aqui fica só a
// busca atual (a query string) e a prévia expandida.
const SequencesActions = {
  LOAD_PERFORMED: 'SequencesActions.LOAD_PERFORMED',
  LOADED_PERFORMED: 'SequencesActions.LOADED_PERFORMED',
  SEARCH: 'SequencesActions.SEARCH',
  TOGGLE_PREVIEW: 'SequencesActions.TOGGLE_PREVIEW',

  // Busca com os filtros e o texto do FiltersReducer no momento da chamada.
  search() {
    return (dispatch, getState) => {
      const { filters, filtersExtra, order, query } = getState().FiltersReducer;
      const activeFilters = filters.filter(item => item.isActive);
      const activeFiltersExtra = filtersExtra.filter(item => item.isActive);
      const queryString = getSearchQueryString(activeFilters, activeFiltersExtra, query, order);
      dispatch({ type: SequencesActions.SEARCH, query: queryString });
    };
  },
  load() {
    return { type: SequencesActions.SEARCH, query: '' };
  },
  loadPerformed() {
    return Api.simpleGet(
      '/api/sequencias_realizadas',
      SequencesActions.LOAD_PERFORMED,
      SequencesActions.LOADED_PERFORMED
    );
  },
  loadWithFilter(filter) {
    return { type: SequencesActions.SEARCH, query: getFiltersQueryString([filter]) };
  },
  togglePreview(id) {
    return { type: SequencesActions.TOGGLE_PREVIEW, id };
  },
};

export default SequencesActions;
