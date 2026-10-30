import { connect } from 'react-redux';
import CurricularComponent from 'components/objects/CurricularComponent';
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
)(CurricularComponent);
