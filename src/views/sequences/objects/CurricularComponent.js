import { connect } from 'react-redux';
import CurricularComponent from 'components/objects/CurricularComponent';
import { sequenceFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleFilter: data => {
      dispatch(sequenceFiltersActions.toggleFilter(data));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CurricularComponent);
