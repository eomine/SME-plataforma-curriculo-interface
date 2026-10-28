import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { showLoading, hideLoading } from 'reducers/bodySlice';
import {
  useGetLearningObjectivesQuery,
  useGetProjectOptionsQuery,
  useGetProjectToEditQuery,
  useGetSchoolsQuery,
} from 'data/curriculoApi';
import getTeacherBlocked from 'data/getTeacherBlocked';
import getTeacherId from 'data/getTeacherId';
import isLogged from 'data/isLogged';

const noOptions = {
  curricularComponents: [],
  knowledgeMatrices: [],
  studentProtagonisms: [],
  segments: [],
  stages: [],
  years: [],
  dres: [],
};

// Liga os formulários de criar e editar projeto ao curriculoApi. Passa as
// opções (curricularComponents, segments, dres etc.), os objetivos de
// aprendizagem e as escolas, e as funções getLearningObjectives e getSchools,
// que escolhem o que carregar (como as actions antigas, chamadas quando o
// usuário muda a seleção). Com `edit`, passa também o projeto da URL.
// Os dados da sessão (isLogged, teacherId, blocked) vêm do localStorage.
export default function withProjectForm(Component, { edit = false } = {}) {
  function WithProjectForm(props) {
    const dispatch = useDispatch();
    const [learningObjectivesArg, setLearningObjectivesArg] = useState(null);
    const [schoolsArg, setSchoolsArg] = useState(null);

    const options = useGetProjectOptionsQuery();
    // Como antes, a edição sempre busca o projeto de novo.
    const project = useGetProjectToEditQuery(edit ? props.match.params.slug : skipToken, { refetchOnMountOrArgChange: true });
    // `data` (e não currentData): a lista anterior fica até chegar a nova.
    const learningObjectives = useGetLearningObjectivesQuery(learningObjectivesArg || skipToken);
    const schools = useGetSchoolsQuery(schoolsArg || skipToken);

    const getLearningObjectives = useCallback(
      (curricularComponentIds, yearIds) => setLearningObjectivesArg({ curricularComponentIds, yearIds }),
      []
    );
    const getSchools = useCallback(regionalEducationBoardId => setSchoolsArg(regionalEducationBoardId), []);

    const isLoading = options.isFetching || (edit && project.isFetching);
    useEffect(() => {
      if (!isLoading) {
        return undefined;
      }
      dispatch(showLoading());
      return () => dispatch(hideLoading());
    }, [dispatch, isLoading]);

    return (
      <Component
        {...props}
        {...(options.data || noOptions)}
        learningObjectives={learningObjectives.data || []}
        schools={schools.data || []}
        getLearningObjectives={getLearningObjectives}
        getSchools={getSchools}
        isLoading={isLoading}
        isLogged={isLogged()}
        teacherId={getTeacherId()}
        blocked={getTeacherBlocked()}
        {...(edit ? { project: project.currentData || null } : {})}
      />
    );
  }

  WithProjectForm.displayName = `withProjectForm(${Component.displayName || Component.name})`;
  return WithProjectForm;
}
