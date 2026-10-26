import { combineReducers } from '@reduxjs/toolkit';
import { curriculoApi } from 'data/curriculoApi';
import ActivityReducer from './ActivityReducer';
import AlertReducer from './AlertReducer';
import BodyReducer from './BodyReducer';
import CreateProjectReducer from './CreateProjectReducer';
import EditProjectReducer from './EditProjectReducer';
import ChallengeReducer from './ChallengeReducer';
import ChallengesReducer from './ChallengesReducer';
import CollectionReducer from './CollectionReducer';
import CollectionsReducer from './CollectionsReducer';
import ConfirmReducer from './ConfirmReducer';
import FiltersReducer from './FiltersReducer';
import HomeReducer from './HomeReducer';
import KnowledgeMatrixReducer from './KnowledgeMatrixReducer';
import LearningObjectivesReducer from './LearningObjectivesReducer';
import ProjectFiltersReducer from './ProjectFiltersReducer';
import ProjectsReducer from './ProjectsReducer';
import ProjectReducer from './ProjectReducer';
import ProfileReducer from './ProfileReducer';
import RatingReducer from './RatingReducer';
import SequenceReducer from './SequenceReducer';
import SequencesReducer from './SequencesReducer';
import SnackbarReducer from './SnackbarReducer';
import SurveyFormReducer from './SurveyFormReducer';
import TeacherSurveyFormsReducer from './TeacherSurveyFormsReducer';

export default combineReducers({
  [curriculoApi.reducerPath]: curriculoApi.reducer,
  ActivityReducer,
  AlertReducer,
  BodyReducer,
  CreateProjectReducer,
  EditProjectReducer,
  ChallengeReducer,
  ChallengesReducer,
  CollectionReducer,
  CollectionsReducer,
  ConfirmReducer,
  FiltersReducer,
  HomeReducer,
  KnowledgeMatrixReducer,
  LearningObjectivesReducer,
  ProfileReducer,
  ProjectFiltersReducer,
  ProjectsReducer,
  ProjectReducer,
  RatingReducer,
  TeacherSurveyFormsReducer,
  SequenceReducer,
  SequencesReducer,
  SnackbarReducer,
  SurveyFormReducer,
});
