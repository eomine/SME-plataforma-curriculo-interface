import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FiltersActions from 'actions/FiltersActions';
import { showAllSequences } from 'reducers/sequencesSlice';
import styles from './ResultsNotFound.module.scss';

class ResultsNotFound extends Component {
  onClicked = () => {
    this.props.clearSearch();
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <p>
          A sequência que você procura não foi encontrada. Mas você pode
          procurar por outras sequências usando filtros diferentes.
        </p>
        <button className="btn" onClick={this.onClicked}>
          Fazer nova busca
        </button>
      </div>
    );
  }
}

ResultsNotFound.propTypes = {
  clearSearch: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    clearSearch: () => {
      dispatch(FiltersActions.clearFilters());
      dispatch(showAllSequences());
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ResultsNotFound);
