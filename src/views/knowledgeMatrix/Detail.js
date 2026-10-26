import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import { history } from 'utils/history';
import FullModal from 'components/layout/FullModal';
import { useGetKnowledgeMatricesQuery } from 'data/curriculoApi';
import withQuery from 'utils/withQuery';
import iconCloseBig from 'images/icons/closeBig.svg';
import styles from './Detail.module.scss';

class Detail extends Component {
  onClickedClose = () => {
    history.back();
  };

  render() {
    const index = parseInt(this.props.match.params.index, 10);
    const data = this.props.data.filter(item => item.sequence === index)[0];
    const title = data ? data.title : '';
    const knowDescription = data ? data.know_description : '';
    const forDescription = data ? data.for_description : '';

    return (
      <FullModal>
        <section className={styles.wrapper}>
          <div className="container">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className={styles.header}>
                  <div className={styles.number}>{index}</div>
                  <h1>{title}</h1>
                </div>
                <div className={styles.contents}>
                  <h2>Saber</h2>
                  <p>{knowDescription}</p>
                  <h2>Para</h2>
                  <p>{forDescription}</p>
                  <NavLink
                    to={`/sequencias/matriz-de-saberes/${index}`}
                    className={styles.button}
                  >
                    Ver Sequências de Atividades Relacionadas
                  </NavLink>
                </div>
                <button className={styles.close} onClick={this.onClickedClose}>
                  <img src={iconCloseBig} alt="Fechar" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </FullModal>
    );
  }
}

Detail.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withQuery(useGetKnowledgeMatricesQuery, {
  mapResult: result => ({ data: result.data || [] }),
  showLoading: true,
})(Detail);
