import { connect } from 'react-redux';
import StageButton from 'components/objects/StageButton';
import { projectFiltersActions } from 'reducers/filtersSlice';

const mapDispatchToProps = dispatch => {
  return {
    toggleStages: data => {
      dispatch(projectFiltersActions.toggleStages(data))
    },
    getYears: data => {
      dispatch(projectFiltersActions.getYears(data))
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(StageButton);
