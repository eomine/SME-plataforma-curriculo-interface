import { connect } from 'react-redux';
import StageButton from 'components/objects/StageButton';
import { sequenceFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleStages: data => {
      dispatch(sequenceFiltersActions.toggleStages(data))
    },
    getYears: data => {
      dispatch(sequenceFiltersActions.getYears(data))
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(StageButton);
