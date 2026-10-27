import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetCollectionsQuery } from 'data/curriculoApi';
import getTeacherId from 'data/getTeacherId';
import withQuery from 'utils/withQuery';
import { withProject } from 'data/itemQueries';
import Collection from './Collection';
import DesktopModal from 'components/layout/DesktopModal';
import ModalHeader from 'components/header/ModalHeader';
import ModalPage from 'components/layout/ModalPage';
import createModalLink from 'utils/createModalLink';
import iconPlus from 'images/icons/plus1.svg';
import styles from './SaveProject.module.scss';

class SaveProject extends Component {
  render() {
    if (this.props.data == null) {
      return <span />;
    }

    const { collections, data } = this.props;

    const items = collections.map((item, i) => {
      return <Collection key={i} projectId={data.id} {...item} />;
    });

    const base = this.props.location.pathname.match(/projetos/)
      ? 'projetos'
      : 'projeto';
    const link = createModalLink(`/${base}/${data.slug}/criar-colecao`);
    link.state.projectId = data.id;

    const btnCreate = (
      <NavLink className={styles.btn} {...link}>
        <img src={iconPlus} alt="Criar coleção" />
        Criar coleção
      </NavLink>
    );

    return (
      <DesktopModal>
        <ModalPage>
          <ModalHeader title="Salvar Projetos" />
          <div className={styles.row}>
            <div className={styles.col1}>
            </div>
            <div className={styles.col2}>
              <div className={styles.small}>
                <hr />
              </div>
              <div className={styles.list}>
                <p>Selecione uma coleção</p>
                {items}
              </div>
              <div className={styles.footer}>{btnCreate}</div>
            </div>
          </div>
        </ModalPage>
      </DesktopModal>
    );
  }
}

SaveProject.propTypes = {
  collections: PropTypes.array.isRequired,
  data: PropTypes.object,
};

const withCollections = withQuery(useGetCollectionsQuery, {
  arg: () => getTeacherId() || skipToken,
  mapResult: result => ({ collections: result.data || [] }),
});

export default withProject(withCollections(SaveProject));
