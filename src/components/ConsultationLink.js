import { connect } from 'react-redux';
import React, {Component} from 'react';
import styles from './ConsultationLink.scss';

class ConsultationLink extends Component {
  changeDomain() {
    var link_regex = /^(http|https)/;
    if (link_regex.test(this.props.ConsultationLink)) {
      window.open(this.props.consultatioLink, "_blank");
    } else {
      const changed_link = "https://" + this.props.consultatioLink
      window.open(changed_link, "_blank");
    }
  }

  render() {
    return (
      <button type="button" className={styles.button} onClick={() => this.changeDomain()}>{this.props.title}</button>
    );
  };
};
export default connect()(ConsultationLink);
