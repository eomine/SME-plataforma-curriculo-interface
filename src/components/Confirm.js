import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { answerConfirmation } from 'reducers/messagesSlice';
import iconClose from 'images/icons/close.svg';
import styles from './Alert.module.scss';
import styles1 from './Confirm.module.scss';

Modal.setAppElement('#root');

class Confirm extends Component {
  onClickedYes = () => {
    this.props.answer(true);
  };

  close = () => {
    this.props.answer(false);
  };

  componentDidMount() {
    this.target = document.querySelector('#confirm');
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpened && !prevProps.isOpened) {
      disableBodyScroll(this.target);
    } else if (!this.props.isOpened && prevProps.isOpened) {
      enableBodyScroll(this.target);
    }
  }

  render() {
    const { isOpened, labelYes, labelNo, message, title } = this.props;

    return (
      <div id="confirm">
        <Modal
          className={styles1.confirm}
          overlayClassName={styles.overlay}
          isOpen={isOpened}
          onRequestClose={this.close}
          shouldCloseOnOverlayClick={true}
        >
          <button className={styles.btnClose} onClick={this.close}>
            <img src={iconClose} alt="Fechar" />
          </button>
          <p>
            <strong>{title}</strong>
          </p>
          <p>{message}</p>
          <button className={styles1.btnYes} onClick={this.onClickedYes}>
            {labelYes}
          </button>
          <button className={styles1.btnNo} onClick={this.close}>
            {labelNo}
          </button>
        </Modal>
      </div>
    );
  }
}

Confirm.propTypes = {
  answer: PropTypes.func.isRequired,
  isOpened: PropTypes.bool,
  labelNo: PropTypes.string.isRequired,
  labelYes: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    isOpened: state.messages.confirm.isOpened,
    labelNo: state.messages.confirm.labelNo,
    labelYes: state.messages.confirm.labelYes,
    message: state.messages.confirm.message,
    title: state.messages.confirm.title,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    answer: confirmed => {
      dispatch(answerConfirmation(confirmed));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirm);
