import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetCollectionsQuery } from 'data/curriculoApi';
import getTeacherId from 'data/getTeacherId';
import withQuery from 'utils/withQuery';
import { withSequence, withSequenceCollections } from 'data/itemQueries';
import BigPreview from 'components/objects/BigPreview';
import Collection from './Collection';
import DesktopModal from 'components/layout/DesktopModal';
import ModalHeader from 'components/header/ModalHeader';
import ModalPage from 'components/layout/ModalPage';
import SequencePreview from 'views/activity/SequencePreview';
import createModalLink from 'utils/createModalLink';
import iconPlus from 'images/icons/plus1.svg';
import styles from './SaveSequence.module.scss';

class SaveSequence extends Component {
  render() {
    if (this.props.data == null) {
      return <span />;
    }

    const { collections, data, inCollections, isSaved } = this.props;

    const items = collections.map((item, i) => {
      return <Collection key={i} sequenceId={data.id} {...item} />;
    });

    const base = this.props.location.pathname.match(/sequencias/)
      ? 'sequencias'
      : 'sequencia';
    const link = createModalLink(`/${base}/${data.slug}/criar-colecao`);
    link.state.sequenceId = data.id;

    const btnCreate = (
      <NavLink className={styles.btn} {...link}>
        <img src={iconPlus} alt="Criar coleção" />
        Criar coleção
      </NavLink>
    );

    const names = inCollections.map(item => item.name).join(', ');

    const savedText = isSaved ? (
      <p className={styles.saved}>Você já salvou esta sequência em {names}.</p>
    ) : null;

    return (
      <DesktopModal>
        <ModalPage>
          <ModalHeader title="Salvar sequência" />
          <div className={styles.row}>
            <div className={styles.col1}>
              <BigPreview data={data} />
              {savedText}
            </div>
            <div className={styles.col2}>
              <div className={styles.small}>
                <SequencePreview sequence={data} />
                {savedText}
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

SaveSequence.propTypes = {
  collections: PropTypes.array.isRequired,
  data: PropTypes.object,
};

const withCollections = withQuery(useGetCollectionsQuery, {
  arg: () => getTeacherId() || skipToken,
  mapResult: result => ({ collections: result.data || [] }),
});

export default withSequence()(withSequenceCollections()(withCollections(SaveSequence)));
