import React from 'react';
import PropTypes from 'prop-types';
import ReadMore from 'components/ReadMore';
import styles from './ModuleLongText.module.scss';

class ModuleLongText extends React.PureComponent {
  render() {
    return (
      <div className={styles.wrapper}>
        <h4>{this.props.title}</h4>
        <ReadMore lines={15}>{this.props.text}</ReadMore>
      </div>
    );
  }
}

ModuleLongText.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ModuleLongText;
