import { createSlice } from '@reduxjs/toolkit';

// As sequências da home vêm do curriculoApi (getSequences, a mesma lista da
// página de sequências); aqui fica só a prévia expandida.
const homeSlice = createSlice({
  name: 'home',
  initialState: {
    expandedId: null,
  },
  reducers: {
    toggleHomePreview(state, action) {
      state.expandedId = state.expandedId === action.payload ? null : action.payload;
    },
  },
});

export const { toggleHomePreview } = homeSlice.actions;
export default homeSlice.reducer;
