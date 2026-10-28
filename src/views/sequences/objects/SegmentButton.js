import { connect } from 'react-redux';
import SegmentButton from 'components/objects/SegmentButton';
import { sequenceFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleSegments: data => {
      dispatch(sequenceFiltersActions.toggleSegments(data))
    },
    getStages: data => {
      dispatch(sequenceFiltersActions.getStages(data))
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SegmentButton);
