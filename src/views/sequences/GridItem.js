import { connect } from 'react-redux';
import { toggleSequencePreview } from 'reducers/sequencesSlice';
import GridItemBase from './GridItemBase';

const mapDispatchToProps = dispatch => {
  return {
    togglePreview: id => {
      dispatch(toggleSequencePreview(id));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(GridItemBase);
