import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import { connect } from 'react-redux';
import { history } from 'utils/history';
import ClassroomYear from 'components/objects/ClassroomYear';
import CollectionActions from 'actions/CollectionActions';
import ConfirmActions from 'actions/ConfirmActions';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  useGetCollectionProjectsQuery,
  useGetCollectionQuery,
  useGetCollectionSequencesQuery,
} from 'data/curriculoApi';
import getTeacherId from 'data/getTeacherId';
import withQuery from 'utils/withQuery';
import EmptySequenceList from './EmptySequenceList';
import EmptyProjectList from './EmptyProjectList';
import Page from 'components/layout/Page';
import SequenceList from './SequenceList';
import ProjectList from './ProjectList';
import createModalLink from 'utils/createModalLink';
import iconClose from 'images/icons/closeBig.svg';
import iconEdit from 'images/icons/edit.svg';
import iconDelete from 'images/icons/delete1.svg';
import styles from './Collection.module.scss';

class Collection extends Component {
  onClickedClose = () => {
    history.back();
  };

  onClickedConfirm = () => {
    this.props.delete(this.props.match.params.id);
    history.back();
  };

  onClickedDelete = () => {
    const { name } = this.props.data;

    this.props
      .openConfirm(
        'Excluir essa coleção e todas as suas sequências de atividades?',
        `Sua coleção ${name} e todas as suas sequências e projetos serão excluídos permanentemente.`,
        'Excluir',
        'Cancelar'
      )
      .then(confirmed => confirmed && this.onClickedConfirm());
  };

  render() {
    const { data, classrooms, sequences, projects } = this.props;
    const { id, name } = data;

    const link = createModalLink(`/colecao/${id}/editar`);

    const years = classrooms.map((year, i) => {
      return <ClassroomYear key={i} year={year.year} color={year.color} />;
    });

    const projectContents = projects.length ? (
      <ProjectList collectionId={id} items={projects} />
    ) : (
      <EmptyProjectList />
    );

    const sequenceContents = sequences.length ? (
      <SequenceList collectionId={id} items={sequences} />
    ) : (
      <EmptySequenceList />
    );

    return (
      <Page>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <NavLink {...link}>
              <img src={iconEdit} alt="Editar" />
            </NavLink>
            <button onClick={this.onClickedDelete}>
              <img src={iconDelete} alt="Excluir" />
            </button>
            <button className={styles.btnClose} onClick={this.onClickedClose}>
              <img src={iconClose} alt="Fechar" />
            </button>
          </div>
          <header className={styles.info}>
            <h2>{name}</h2>
            <div className={styles.years}>{years}</div>
          </header>
        </div>
        {sequenceContents}
        {projectContents}
      </Page>
    );
  }
}

Collection.propTypes = {
  classrooms: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
  openConfirm: PropTypes.func.isRequired,
  sequences: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
};

Collection.defaultProps = {
  classrooms: [],
};

const mapDispatchToProps = dispatch => {
  return {
    delete: id => {
      dispatch(CollectionActions.delete(id));
    },
    openConfirm: (title, message, labelYes, labelNo) =>
      dispatch(ConfirmActions.open(title, message, labelYes, labelNo)),
  };
};

const collectionArg = props =>
  getTeacherId() ? { teacherId: getTeacherId(), id: props.match.params.id } : skipToken;

const withCollection = withQuery(useGetCollectionQuery, {
  arg: collectionArg,
  mapResult: result => ({ data: result.currentData || {} }),
});
const withSequences = withQuery(useGetCollectionSequencesQuery, {
  arg: collectionArg,
  mapResult: result => ({ sequences: result.currentData || [] }),
  showLoading: true,
});
const withProjects = withQuery(useGetCollectionProjectsQuery, {
  arg: collectionArg,
  mapResult: result => ({ projects: result.currentData || [] }),
});

export default withCollection(withSequences(withProjects(connect(
  null,
  mapDispatchToProps
)(Collection))));
