import { combineReducers } from '@reduxjs/toolkit';
import { curriculoApi } from 'data/curriculoApi';
import body from './bodySlice';
import challenges from './challengesSlice';
import FiltersReducer from './FiltersReducer';
import home from './homeSlice';
import LearningObjectivesReducer from './LearningObjectivesReducer';
import messages from './messagesSlice';
import ProjectFiltersReducer from './ProjectFiltersReducer';
import projects from './projectsSlice';
import project from './projectSlice';
import ProfileReducer from './ProfileReducer';
import sequences from './sequencesSlice';

export default combineReducers({
  [curriculoApi.reducerPath]: curriculoApi.reducer,
  body,
  challenges,
  FiltersReducer,
  home,
  LearningObjectivesReducer,
  // Alerta, diálogo de confirmação e snackbar
  messages,
  ProfileReducer,
  ProjectFiltersReducer,
  projects,
  project,
  sequences,
});
