import { connect } from 'react-redux';
import { toggleProjectPreview } from 'reducers/projectsSlice';
import GridItemBase from './GridItemBase';

const mapDispatchToProps = dispatch => {
  return {
    togglePreview: id => {
      dispatch(toggleProjectPreview(id));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(GridItemBase);
