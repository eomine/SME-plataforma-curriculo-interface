import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { projectFiltersActions } from 'reducers/filtersSlice';
import chevronRight from 'images/chevrons/right.svg';
import styles from './Category.module.scss';

class Category extends Component {
  onClicked = () => {
    this.props.showCategory(this.props.data);
  };

  render() {
    return (
      <button className={styles.wrapper} onClick={this.onClicked}>
        {this.props.data.name}
        <img src={chevronRight} alt={this.props.data.name} />
      </button>
    );
  }
}

Category.propTypes = {
  data: PropTypes.object.isRequired,
  showCategory: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    showCategory: data => {
      dispatch(projectFiltersActions.showCategory(data));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Category);
