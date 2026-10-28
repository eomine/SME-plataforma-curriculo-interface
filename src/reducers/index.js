import { combineReducers } from '@reduxjs/toolkit';
import { curriculoApi } from 'data/curriculoApi';
import body from './bodySlice';
import challenges from './challengesSlice';
import { projectFiltersReducer, sequenceFiltersReducer } from './filtersSlice';
import home from './homeSlice';
import LearningObjectivesReducer from './LearningObjectivesReducer';
import messages from './messagesSlice';
import projects from './projectsSlice';
import project from './projectSlice';
import ProfileReducer from './ProfileReducer';
import sequences from './sequencesSlice';

export default combineReducers({
  [curriculoApi.reducerPath]: curriculoApi.reducer,
  body,
  challenges,
  home,
  LearningObjectivesReducer,
  // Alerta, diálogo de confirmação e snackbar
  messages,
  ProfileReducer,
  projectFilters: projectFiltersReducer,
  projects,
  project,
  sequences,
  sequenceFilters: sequenceFiltersReducer,
});
