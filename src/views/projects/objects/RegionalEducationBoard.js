import { connect } from 'react-redux';
import RegionalEducationBoard from 'components/objects/RegionalEducationBoard';
import { projectFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleFilter: data => {
      dispatch(projectFiltersActions.toggleFilter(data));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(RegionalEducationBoard);
