import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import { API_URL } from 'data/constants';
import { history } from 'utils/history';
import { useGetSustainableDevGoalQuery } from 'data/curriculoApi';
import withQuery from 'utils/withQuery';
import FullModal from 'components/layout/FullModal';
import Goal from './Goal';
import iconCloseBigWhite from 'images/icons/closeBigWhite.svg';
import styles from './Detail.module.scss';

class Detail extends Component {
  onClickedClose = () => {
    history.back();
  };

  render() {
    const data = this.props.data;

    if (!data) {
      return <span />;
    }

    const goals = data.goals.map((item, i) => {
      return <Goal key={i} data={item} index={i + 1} />;
    });

    const style = { backgroundColor: data.color };

    return (
      <FullModal>
        <section className={styles.wrapper}>
          <header className={styles.header} style={style}>
            <div className="container">
              <div className="row">
                <div className="col-md-8 offset-md-2">
                  <div className={styles.number}>{data.sequence}</div>
                  <h1>{data.name}</h1>
                  <h2>{data.description}</h2>
                  <img src={API_URL + data.sub_icon} alt={data.name} />
                  <p>{data.text}</p>
                </div>
              </div>
            </div>
          </header>
          <div className={styles.contents}>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <h2>Conheça as metas</h2>
                <div className={styles.list}>{goals}</div>
                <NavLink
                  to={`/sequencias/ods/${this.props.match.params.id}`}
                  className={styles.button}
                >
                  Ver Sequências de Atividades Relacionadas
                </NavLink>
              </div>
            </div>
          </div>
          <button className={styles.close} onClick={this.onClickedClose}>
            <img src={iconCloseBigWhite} alt="Fechar" />
          </button>
        </section>
      </FullModal>
    );
  }
}

Detail.propTypes = {
  data: PropTypes.object,
};

export default withQuery(useGetSustainableDevGoalQuery, {
  arg: props => props.match.params.id,
  mapResult: result => ({ data: result.currentData || null }),
})(Detail);
