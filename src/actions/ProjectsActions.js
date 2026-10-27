import { getSearchQueryString } from 'data/getProjectFiltersQueryString';

// A lista de projetos vem do curriculoApi (getProjects); aqui fica a busca
// atual (a query string) e a prévia expandida.
const ProjectsActions = {
  SEARCH: 'ProjectsActions.SEARCH',
  TOGGLE_PREVIEW: 'ProjectsActions.TOGGLE_PREVIEW',

  // Busca com os filtros e o texto do ProjectFiltersReducer no momento da chamada.
  search() {
    return (dispatch, getState) => {
      const { filters, filtersExtra, order, query } = getState().ProjectFiltersReducer;
      const activeFilters = filters.filter(item => item.isActive);
      const activeFiltersExtra = filtersExtra.filter(item => item.isActive);
      const queryString = getSearchQueryString(activeFilters, activeFiltersExtra, query, order);
      dispatch({ type: ProjectsActions.SEARCH, query: queryString });
    };
  },
  load() {
    return { type: ProjectsActions.SEARCH, query: '' };
  },
  togglePreview(id) {
    return { type: ProjectsActions.TOGGLE_PREVIEW, id };
  },
};

export default ProjectsActions;
