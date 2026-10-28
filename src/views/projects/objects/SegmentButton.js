import { connect } from 'react-redux';
import SegmentButton from 'components/objects/SegmentButton';
import { projectFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleSegments: data => {
      dispatch(projectFiltersActions.toggleSegments(data))
    },
    getStages: data => {
      dispatch(projectFiltersActions.getStages(data))
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SegmentButton);
