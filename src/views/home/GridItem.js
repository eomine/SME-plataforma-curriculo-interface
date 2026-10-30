import { connect } from 'react-redux';
import { toggleHomePreview } from 'reducers/homeSlice';
import GridItemBase from 'views/sequences/GridItemBase';

const mapDispatchToProps = dispatch => {
  return {
    togglePreview: id => {
      dispatch(toggleHomePreview(id));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(GridItemBase);
