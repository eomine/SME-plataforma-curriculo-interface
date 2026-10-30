import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import { connect } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetCollectionsQuery, useGetMyProjectsQuery } from 'data/curriculoApi';
import getTeacherId from 'data/getTeacherId';
import withQuery from 'utils/withQuery';
import { selectSavedChallenges } from 'data/challengeQueries';
import { history } from 'utils/history';
import Avatar from './Avatar';
import MyProjectList from './projects/MyProjectList';
import ChallengeList from './challenges/ChallengeList';
import CollectionList from './collections/CollectionList';
import EmptyList from './collections/EmptyList';
import Page from 'components/layout/Page';
import createModalLink from 'utils/createModalLink';
import withWidth from 'components/hoc/withWidth';
import iconEdit from 'images/icons/edit.svg';
import styles from './Profile.module.scss';

class Profile extends Component {
  onClickedChallenge = () => {
    history.push('/desafio/projeto-sinais-luminosos-na-aviacao');
  };

  render() {
    const { data, challenges, collections, projects } = this.props;
    const { nickname } = data;

    const numCollections = collections.length;
    const wordCollections = numCollections === 1 ? 'coleção' : 'coleções';
    const collectionList =
      numCollections > 0 ? <CollectionList items={collections} /> : <EmptyList />;

    const challengeList = <ChallengeList items={challenges} />;

    const myProjectList = <MyProjectList items={projects} />

    const size = this.props.windowWidth < 768 ? 60 : 80;

    const linkEdit = createModalLink('/perfil/editar');

    return (
      <Page>
        <header className={styles.header}>
          <div className={styles.rowName}>
            <div className={styles.photoAndName}>
              <Avatar size={size} />
              <div className={styles.name}>
                <h2>{nickname}</h2>
                <NavLink {...linkEdit}>Editar perfil</NavLink>
              </div>
            </div>
            <NavLink {...linkEdit}>
              <img src={iconEdit} alt="Editar perfil" />
            </NavLink>
          </div>
          <div className={styles.rowNumbers}>
            <div>
              <em>{numCollections}</em> {wordCollections}
            </div>
          </div>
        </header>
        {collectionList}
        <hr></hr>
        {myProjectList}
        <hr></hr>
        {challengeList}
      </Page>
    );
  }
}

Profile.propTypes = {
  challenges: PropTypes.array.isRequired,
  collections: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    challenges: selectSavedChallenges(state),
    data: state.ProfileReducer,
  };
};

// As coleções e os meus projetos carregam depois do perfil, como antes (o
// teacherId vem dele).
const teacherIdAfterProfile = props => (props.data.id && getTeacherId() ? getTeacherId() : skipToken);
const withCollections = withQuery(useGetCollectionsQuery, {
  arg: teacherIdAfterProfile,
  mapResult: result => ({ collections: result.data || [] }),
});
// Como antes, busca de novo sempre que o perfil abre, e o loading global fica
// até os projetos chegarem (o perfil em si vem do Header), ou até a busca
// falhar (o erro aparece no alerta).
const withMyProjects = withQuery(useGetMyProjectsQuery, {
  arg: teacherIdAfterProfile,
  options: { refetchOnMountOrArgChange: true },
  showLoading: result => !result.currentData && !result.isError,
  mapResult: result => ({ projects: result.data || [] }),
});

export default connect(mapStateToProps)(withCollections(withMyProjects(withWidth(Profile))));
