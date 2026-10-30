import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Page from 'components/layout/Page';
import { useGetSustainableDevGoalsQuery } from 'data/curriculoApi';
import withQuery from 'utils/withQuery';
import styles from './SustainableDevGoals.module.scss';

class SustainableDevGoals extends Component {
  render() {
    const items = this.props.data.map((item, i) => {
      return <Button key={i} data={item} />;
    });

    return (
      <Page>
        <section className={styles.wrapper}>
          <header className={styles.header}>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <h1>Objetivos de Desenvolvimento Sustentável (ODS)</h1>
                <p>
                  Temas prementes, como direitos humanos, meio ambiente,
                  desigualdades sociais e regionais, intolerâncias culturais e
                  religiosas, abusos de poder, populações excluídas, avanços
                  tecnológicos e seus impactos, política, economia, educação
                  financeira, consumo e sustentabilidade, entre outros, precisam
                  ser debatidos e enfrentados, a fim de que façam a humanidade
                  avançar.
                </p>
                <p>
                  O desafio que se apresenta é entender como essas temáticas
                  atuais podem ser integradas a uma proposta inovadora e
                  emancipatória de currículo, bem como ao cotidiano de escolas e
                  salar de aula. Foi com essa intenção que o Currículo da Cidade
                  incorporou os Objetivos de Desenvolvimento Sustentável (ODS).
                </p>
              </div>
            </div>
          </header>
          <hr />
          <div className="container">
            <div className="row">
              <h2 className="col-md-8 offset-md-2">
                Conheça os Objetivos de Desenvolvimento Sustentável
              </h2>
            </div>
            <div className="row">{items}</div>
          </div>
        </section>
      </Page>
    );
  }
}

SustainableDevGoals.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withQuery(useGetSustainableDevGoalsQuery, {
  mapResult: result => ({ data: result.data || [] }),
  showLoading: true,
})(SustainableDevGoals);
