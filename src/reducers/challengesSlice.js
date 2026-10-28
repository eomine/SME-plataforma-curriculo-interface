import { createSlice } from '@reduxjs/toolkit';
import getTeacherId from 'data/getTeacherId';
import { curriculoApi } from 'data/curriculoApi';

// Ids dos desafios favoritos do professor. As listas de desafios vêm do
// curriculoApi e marcam isSaved a partir daqui. Os favoritos só são
// carregados depois de salvar ou remover um (como antes).
const challengesSlice = createSlice({
  name: 'challenges',
  initialState: {
    saved: [],
  },
  reducers: {
    savedChallengesLoaded(state, action) {
      state.saved = action.payload;
    },
  },
});

const { savedChallengesLoaded } = challengesSlice.actions;

export function loadSavedChallenges() {
  return dispatch =>
    dispatch(curriculoApi.endpoints.getFavoriteChallenges.initiate(getTeacherId(), { subscribe: false, forceRefetch: true }))
      .unwrap()
      .then(data => dispatch(savedChallengesLoaded((data && data.challenges) || [])))
      .catch(() => {});
}

export default challengesSlice.reducer;
