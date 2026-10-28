import { connect } from 'react-redux';
import YearButton from 'components/objects/YearButton';
import { sequenceFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleFilterAndSearch: data => {
      dispatch(sequenceFiltersActions.toggleFilterAndSearch(data));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(YearButton);
