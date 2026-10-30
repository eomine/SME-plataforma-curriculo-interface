import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withChallenge } from 'data/challengeQueries';
import { history } from 'utils/history';
import BigPreview from 'components/objects/BigPreview';
import ChallengePreview from 'views/result/send/ChallengePreview';
import Classroom from './Classroom';
import DesktopModal from 'components/layout/DesktopModal';
import ModalHeader from 'components/header/ModalHeader';
import ModalPage from 'components/layout/ModalPage';
import iconPlus from 'images/icons/plus1.svg';
import styles from './MyResults.module.scss';
import styles1 from 'views/sequence/save/SaveSequence.module.scss';

class MyResults extends Component {
  onClickedAddResult = () => {
    const slug = this.props.match.params.slug;
    history.replace(`/desafio/${slug}/enviar`);
  };

  render() {
    const { challenge, classrooms } = this.props;

    if (!challenge) {
      return <span />;
    }

    const items = classrooms.map((classroom, i) => {
      return (
        <Classroom key={i} name={classroom.name} challenge={challenge} />
      );
    });

    return (
      <DesktopModal isFixed>
        <ModalPage>
          <ModalHeader title="Resultado" />
          <div className={styles1.row}>
            <div className={styles1.col1}>
              <BigPreview data={challenge} label="Desafio" />
            </div>
            <div className={styles1.col2}>
              <div className={styles1.small}>
                <ChallengePreview challenge={challenge} />
                <hr />
              </div>
              <div className={styles.list}>{items}</div>
              <div className={styles1.footer}>
                <button className={styles1.btn} onClick={this.onClickedAddResult}>
                  <img src={iconPlus} alt="Adicionar resultado" />
                  Adicionar resultado
                </button>
              </div>
            </div>
          </div>
        </ModalPage>
      </DesktopModal>
    );
  }
}

MyResults.propTypes = {
  classrooms: PropTypes.array.isRequired,
};

MyResults.defaultProps = {
  classrooms: [
    {
      name: '[2019] EMEF Maria da Silva 1A',
    },
    {
      name: '[2019] EMEF Maria da Silva 2B',
    },
  ],
};

export default withChallenge()(MyResults);
