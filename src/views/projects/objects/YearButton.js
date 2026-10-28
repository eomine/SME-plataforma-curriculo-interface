import { connect } from 'react-redux';
import YearButton from 'components/objects/YearButton';
import { projectFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleFilterAndSearch: data => {
      dispatch(projectFiltersActions.toggleFilterAndSearch(data));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(YearButton);
