import { combineReducers } from '@reduxjs/toolkit';
import { curriculoApi } from 'data/curriculoApi';
import AlertReducer from './AlertReducer';
import BodyReducer from './BodyReducer';
import CreateProjectReducer from './CreateProjectReducer';
import EditProjectReducer from './EditProjectReducer';
import ChallengeReducer from './ChallengeReducer';
import ChallengesReducer from './ChallengesReducer';
import ConfirmReducer from './ConfirmReducer';
import FiltersReducer from './FiltersReducer';
import HomeReducer from './HomeReducer';
import LearningObjectivesReducer from './LearningObjectivesReducer';
import ProjectFiltersReducer from './ProjectFiltersReducer';
import ProjectsReducer from './ProjectsReducer';
import ProjectReducer from './ProjectReducer';
import ProfileReducer from './ProfileReducer';
import SequencesReducer from './SequencesReducer';
import SnackbarReducer from './SnackbarReducer';
import TeacherSurveyFormsReducer from './TeacherSurveyFormsReducer';

export default combineReducers({
  [curriculoApi.reducerPath]: curriculoApi.reducer,
  AlertReducer,
  BodyReducer,
  CreateProjectReducer,
  EditProjectReducer,
  ChallengeReducer,
  ChallengesReducer,
  ConfirmReducer,
  FiltersReducer,
  HomeReducer,
  LearningObjectivesReducer,
  ProfileReducer,
  ProjectFiltersReducer,
  ProjectsReducer,
  ProjectReducer,
  TeacherSurveyFormsReducer,
  SequencesReducer,
  SnackbarReducer,
});
