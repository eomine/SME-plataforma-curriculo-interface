import { createSlice } from '@reduxjs/toolkit';

// Projetos salvos numa coleção nesta sessão: a página do projeto mostra
// "Salvo" para eles (ela não carrega em quais coleções o projeto está).
const projectSlice = createSlice({
  name: 'project',
  initialState: {
    savedIds: [],
  },
  reducers: {
    projectSaved(state, action) {
      state.savedIds.push(action.payload);
    },
  },
});

export const { projectSaved } = projectSlice.actions;
export default projectSlice.reducer;
