import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
import createModalLink from 'utils/createModalLink';
import styles from './Button.module.scss';

class Button extends Component {
  render() {
    const link = createModalLink(
      `/matriz-de-saberes/${this.props.data.sequence}`
    );

    return (
      <div className="col-md-6 col-lg-4">
        <NavLink {...link} className={styles.wrapper}>
          <div className={styles.number}>{this.props.data.sequence}</div>
          <div className={styles.label}>{this.props.data.title}</div>
        </NavLink>
      </div>
    );
  }
}

Button.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Button;
