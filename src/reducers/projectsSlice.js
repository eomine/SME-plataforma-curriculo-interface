import { createSlice } from '@reduxjs/toolkit';
import { getSearchQueryString } from 'data/getProjectFiltersQueryString';

// A lista de projetos vem do curriculoApi (getProjects); aqui fica a busca
// atual (a query string) e a prévia expandida.
const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    query: null,
    expandedId: null,
  },
  reducers: {
    setProjectsQuery(state, action) {
      state.query = action.payload;
      state.expandedId = null;
    },
    toggleProjectPreview(state, action) {
      state.expandedId = state.expandedId === action.payload ? null : action.payload;
    },
  },
});

const { setProjectsQuery } = projectsSlice.actions;
export const { toggleProjectPreview } = projectsSlice.actions;

// Busca com os filtros e o texto do slice projectFilters no momento da chamada.
export function searchProjects() {
  return (dispatch, getState) => {
    const { filters, filtersExtra, order, query } = getState().projectFilters;
    const activeFilters = filters.filter(item => item.isActive);
    const activeFiltersExtra = filtersExtra.filter(item => item.isActive);
    dispatch(setProjectsQuery(getSearchQueryString(activeFilters, activeFiltersExtra, query, order)));
  };
}

export const showAllProjects = () => setProjectsQuery('');

export default projectsSlice.reducer;
