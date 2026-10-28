import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar1 from '@mui/material/Snackbar';
import { connect } from 'react-redux';
import { closeSnackbar } from 'reducers/messagesSlice';

class Snackbar extends Component {
  render() {
    const { close, highlight, isOpened, message } = this.props;
    const content = highlight ? (
      <span>
        {message} <strong>{highlight}</strong>
      </span>
    ) : (
      message
    );

    return (
      <Snackbar1
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isOpened}
        autoHideDuration={6000}
        onClose={close}
        message={content}
      />
    );
  }
}

Snackbar.propTypes = {
  close: PropTypes.func.isRequired,
  isOpened: PropTypes.bool,
  highlight: PropTypes.string,
  message: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    isOpened: state.messages.snackbar.isOpened,
    message: state.messages.snackbar.message,
    highlight: state.messages.snackbar.highlight,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(closeSnackbar());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Snackbar);
