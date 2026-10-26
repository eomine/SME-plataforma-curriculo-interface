import React from 'react';
import PropTypes from 'prop-types';
import styles from './ReadMore.module.scss';

// Mostra as primeiras `lines` linhas do HTML, com um botão para expandir
// quando o texto não cabe.
class ReadMore extends React.PureComponent {
  state = {
    expanded: false,
    truncated: false,
  };

  ref = React.createRef();

  componentDidMount() {
    this.measure();
    window.addEventListener('resize', this.measure);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children || prevProps.lines !== this.props.lines) {
      this.measure();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measure);
  }

  measure = () => {
    const el = this.ref.current;
    if (!el || this.state.expanded) return;
    const truncated = el.scrollHeight > el.clientHeight;
    if (truncated !== this.state.truncated) {
      this.setState({ truncated });
    }
  };

  toggleLines = e => {
    e.preventDefault();

    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    const { children, more, less, lines } = this.props;
    const { expanded, truncated } = this.state;

    return (
      <div className={styles.text}>
        <div
          ref={this.ref}
          className={expanded ? undefined : styles.clamped}
          style={expanded ? undefined : { WebkitLineClamp: lines }}
          dangerouslySetInnerHTML={{ __html: children }}
        />
        {truncated && (
          <button className={styles.toggler} onClick={this.toggleLines}>
            {expanded ? less : more}
          </button>
        )}
      </div>
    );
  }
}

ReadMore.propTypes = {
  children: PropTypes.string.isRequired,
  lines: PropTypes.number,
  less: PropTypes.string,
  more: PropTypes.string,
};

ReadMore.defaultProps = {
  lines: 3,
  more: 'Mostrar mais',
  less: 'Mostrar menos',
};

export default ReadMore;
