import { combineReducers } from '@reduxjs/toolkit';
import { curriculoApi } from 'data/curriculoApi';
import BodyReducer from './BodyReducer';
import ChallengesReducer from './ChallengesReducer';
import FiltersReducer from './FiltersReducer';
import HomeReducer from './HomeReducer';
import LearningObjectivesReducer from './LearningObjectivesReducer';
import messages from './messagesSlice';
import ProjectFiltersReducer from './ProjectFiltersReducer';
import ProjectsReducer from './ProjectsReducer';
import ProjectReducer from './ProjectReducer';
import ProfileReducer from './ProfileReducer';
import SequencesReducer from './SequencesReducer';

export default combineReducers({
  [curriculoApi.reducerPath]: curriculoApi.reducer,
  BodyReducer,
  ChallengesReducer,
  FiltersReducer,
  HomeReducer,
  LearningObjectivesReducer,
  // Alerta, diálogo de confirmação e snackbar
  messages,
  ProfileReducer,
  ProjectFiltersReducer,
  ProjectsReducer,
  ProjectReducer,
  SequencesReducer,
});
