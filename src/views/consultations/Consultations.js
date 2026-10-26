import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useGetConsultationsQuery } from 'data/curriculoApi';
import withQuery from 'utils/withQuery';
import ConsultationsContent from 'components/ConsultationsContent';
import Page from 'components/layout/Page';
import styles from './Consultations.module.scss';

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

class Consultations extends Component {
  state = { windowHeight: 1000 };

  componentDidMount() {
    this.setState({
      windowHeight: window.innerHeight,
    });
  }

  render() {
    const { data } = this.props;

    let segments = data.map(consultation => consultation.segment).filter(onlyUnique).sort()

    return (
      <Page>
        <section>
          <div className="container">
            <h1>Consultas à Rede</h1>
            <br></br>
            <p>
              As consultas publicadas nesta página serão exclusivamente para
              coletar as opiniões e pareceres dos profissionais da Rede
              Municipal de Educação de São Paulo a respeito de publicações
              institucionais e outras possíveis ações. Quando alguma consulta
              estiver vigente, aparecerá uma imagem e seu respectivo título.
            </p>
          </div>
          <hr className={styles.consultationDivider} />
          {segments.map((segment, index) => {
            return (
              <div key={index} className="container">
                <h3 className="">{segment}</h3>
                <ConsultationsContent  segment={segment} consultations={data}></ConsultationsContent>
              </div>
            );
          })}
        </section>
      </Page>
    );
  }
}

Consultations.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withQuery(useGetConsultationsQuery, {
  mapResult: result => ({ data: result.data || [] }),
  showLoading: true,
})(Consultations);
