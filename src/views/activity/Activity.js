import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import ActivityChars from './chars/ActivityChars';
import ActivityCharsMobile from './chars/ActivityCharsMobile';
import Cover from 'views/sequence/Cover';
import Page from 'components/layout/Page';
import SequencePreview from './SequencePreview';
import Title from 'views/sequence/Title';
import Tooltips from 'components/Tooltips';
import getContentBlocks from 'utils/getContentBlocks';
import { useGetActivityQuery } from 'data/curriculoApi';
import withQuery from 'utils/withQuery';
import { withSequenceCollections } from 'data/itemQueries';
import arrowLeft from 'images/arrows/left.svg';
import arrowRight from 'images/arrows/right.svg';
import styles from 'views/sequence/Sequence.module.scss';
import styles1 from './Activity.module.scss';
import typesetMath from 'utils/typesetMath';

class Activity extends Component {
  state = {
    isCharsExpanded: false,
  };

  onClickedChars = () => {
    this.setState({
      isCharsExpanded: !this.state.isCharsExpanded,
    });
  };

  componentDidMount() {
    if (this.props.location.pathname.match(/imprimir/)) {
      window.print();
    }

    typesetMath();
  }

  render() {
    if (this.props.data == null) {
      return <span />;
    }

    const { data, isSaved } = this.props;
    const sequence = data.activity_sequence;

    const contentBlocks = data.content_blocks
      ? getContentBlocks(data.content_blocks)
      : null;

    const linkPrev = `/atividade/${sequence.slug}/${data.last_object}`;
    const linkNext = `/atividade/${sequence.slug}/${data.next_object}`;
    const linkSequence = `/sequencia/${sequence.slug}`;

    const arrowPrev = data.last_object ? (
      <NavLink className={styles1.prev} to={linkPrev}>
        <img src={arrowLeft} alt="Seta" />
        Atividade {data.sequence - 1}
      </NavLink>
    ) : (
      <span />
    );

    const arrowNext = data.next_object ? (
      <NavLink className={styles1.next} to={linkNext}>
        Atividade {data.sequence + 1}
        <img src={arrowRight} alt="Seta" />
      </NavLink>
    ) : null;

    return (
      <Page>
        <section className={styles.wrapper}>
          <SequencePreview isInActivity isSaved={isSaved} sequence={sequence} />
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-lg-8">
                <Cover data={data} sequence={sequence} />
                <Title
                  slug={sequence.slug}
                  text={`Atividade ${data.sequence}`}
                  title={data.title}
                />
                <button
                  className={styles.btnChars}
                  onClick={this.onClickedChars}
                >
                  Ver características
                </button>
                <div className={styles.description}>{contentBlocks}</div>
              </div>
              <div className={styles.chars}>
                <ActivityChars data={this.props.data} />
              </div>
            </div>
          </div>
          <hr />
          <div className={styles1.arrows}>
            {arrowPrev}
            {arrowNext}
          </div>
          <div className={styles1.footer}>
            <NavLink className={styles1.back} to={linkSequence}>
              Voltar para a sequência
            </NavLink>
          </div>
          <ActivityCharsMobile
            data={this.props.data}
            isExpanded={this.state.isCharsExpanded}
            onBack={this.onClickedChars}
          />
          <Tooltips />
        </section>
      </Page>
    );
  }
}

Activity.propTypes = {
  data: PropTypes.object,
  isSaved: PropTypes.bool,
};

export default withQuery(useGetActivityQuery, {
  arg: props => ({ sequenceSlug: props.match.params.slug1, activitySlug: props.match.params.slug2 }),
  mapResult: result => ({ data: result.currentData || null }),
  showLoading: true,
})(withSequenceCollections(props => props.match.params.slug1)(Activity));
