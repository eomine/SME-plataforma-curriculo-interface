import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FiltersActions from 'actions/FiltersActions';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetSequencesInfiniteQuery } from 'data/curriculoApi';
import withQuery from 'utils/withQuery';
import SequencesActions from 'actions/SequencesActions';
import Bar from './bar/Bar';
import Filters from './filters/Filters';
import GridItem from './GridItem';
import Loading from 'components/loading/Loading';
import Page from 'components/layout/Page';
import ResultsLoading from './ResultsLoading';
import ResultsNotFound from './ResultsNotFound';
import styles from './Sequences.module.scss';

class Sequences extends Component {
  state = { windowHeight: 1000 };

  onClickedLoadMore = () => {
    this.props.loadMore();
  };

  componentDidMount() {
    this.setState({
      windowHeight: window.innerHeight,
    });

    const params = this.props.match.params;
    if (params.ods) {
      this.props.loadWithFilter({
        type: 'sustainable_development_goals',
        id: parseInt(params.ods, 10),
      });
    } else if (params.mds) {
      this.props.loadWithFilter({
        type: 'knowledge_matrices',
        id: parseInt(params.mds, 10),
      });
    } else if (params.oda) {
      this.props.loadWithFilter({
        type: 'learning_objectives',
        id: parseInt(params.oda, 10),
      });
    } else if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.isSearch
    ) {
      this.props.search();
    } else {
      this.props.load();
    }
  }

  render() {
    const { data, isSearching, nextPage, totalItems } = this.props;

    const items = data.map((item, i) => {
      return <GridItem key={i} index={i} data={item} />;
    });

    let contents = <ResultsNotFound />;

    if (data.length) {
      const button = nextPage ? (
        <button className={styles.load} onClick={this.onClickedLoadMore}>
          Carregar mais
        </button>
      ) : null;

      const loadingOrButton = isSearching ? <Loading /> : button;

      contents = (
        <div className={styles.list}>
          <div className={styles.results}>
            <h2 className={styles.h2}>
              <strong>{totalItems}</strong> sequências foram encontradas
            </h2>
            <div className="row">{items}</div>
            <div className={styles.center}>{loadingOrButton}</div>
          </div>
        </div>
      );
    } else if (isSearching) {
      contents = <ResultsLoading height={this.state.windowHeight} />;
    }

    return (
      <Page>
        <section className={styles.wrapper}>
          <div className="container">
            <h1 className={styles.h1}>Sequências de Atividades</h1>
            <Bar />
          </div>
          <hr />
          <div className="container">
            <Filters />
          </div>
          {contents}
        </section>
      </Page>
    );
  }
}

Sequences.propTypes = {
  data: PropTypes.array.isRequired,
  isSearching: PropTypes.bool.isRequired,
  nextPage: PropTypes.bool,
  totalItems: PropTypes.number,
  search: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  loadWithFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    query: state.SequencesReducer.query,
    expandedId: state.SequencesReducer.expandedId,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    load: () => {
      dispatch(FiltersActions.clearFilters());
      dispatch(SequencesActions.load());
    },
    loadWithFilter: data => {
      dispatch(FiltersActions.clearFilters());
      dispatch(FiltersActions.cacheFilter(data));
      dispatch(SequencesActions.loadWithFilter(data));
    },
    search: () => {
      dispatch(SequencesActions.search());
    },
  };
};

// A busca atual (query) vem do SequencesReducer; os resultados, do cache.
const withSequences = withQuery(useGetSequencesInfiniteQuery, {
  arg: props => (props.query === null ? skipToken : props.query),
  mapResult: (result, props) => {
    const pages = result.data ? result.data.pages : [];
    return {
      data: pages
        .flatMap(page => page.items)
        .map(item => ({ ...item, isExpanded: item.id === props.expandedId })),
      isSearching: result.isFetching,
      nextPage: result.hasNextPage,
      totalItems: pages.length ? pages[0].totalItems : 0,
      loadMore: result.fetchNextPage,
    };
  },
  // Loading global a cada nova busca, mas não ao carregar mais.
  showLoading: result => result.isFetching && !result.isFetchingNextPage,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSequences(Sequences));
