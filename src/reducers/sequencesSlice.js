import { createSlice } from '@reduxjs/toolkit';
import getFiltersQueryString, { getSearchQueryString } from 'data/getFiltersQueryString';

// A lista de sequências vem do curriculoApi (getSequences); aqui fica só a
// busca atual (a query string) e a prévia expandida.
const sequencesSlice = createSlice({
  name: 'sequences',
  initialState: {
    query: null,
    expandedId: null,
  },
  reducers: {
    setSequencesQuery(state, action) {
      state.query = action.payload;
      state.expandedId = null;
    },
    toggleSequencePreview(state, action) {
      state.expandedId = state.expandedId === action.payload ? null : action.payload;
    },
  },
});

const { setSequencesQuery } = sequencesSlice.actions;
export const { toggleSequencePreview } = sequencesSlice.actions;

// Busca com os filtros e o texto do slice sequenceFilters no momento da chamada.
export function searchSequences() {
  return (dispatch, getState) => {
    const { filters, filtersExtra, order, query } = getState().sequenceFilters;
    const activeFilters = filters.filter(item => item.isActive);
    const activeFiltersExtra = filtersExtra.filter(item => item.isActive);
    dispatch(setSequencesQuery(getSearchQueryString(activeFilters, activeFiltersExtra, query, order)));
  };
}

export const showAllSequences = () => setSequencesQuery('');

export const searchSequencesWithFilter = filter => setSequencesQuery(getFiltersQueryString([filter]));

export default sequencesSlice.reducer;
