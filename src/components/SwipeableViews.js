import React from 'react';
import PropTypes from 'prop-types';
import styles from './SwipeableViews.module.scss';

// Painéis lado a lado que deslizam com o scroll-snap nativo. `index` controla
// o painel visível; `onChangeIndex` avisa quando o usuário arrasta para outro.
class SwipeableViews extends React.Component {
  ref = React.createRef();

  componentDidMount() {
    this.scrollTo(this.props.index, 'auto');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.index !== this.props.index && this.currentIndex() !== this.props.index) {
      this.scrollTo(this.props.index, 'smooth');
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollTimeout);
  }

  currentIndex() {
    const el = this.ref.current;
    return Math.round(el.scrollLeft / el.clientWidth);
  }

  scrollTo(index, behavior) {
    const el = this.ref.current;
    el.scrollTo({ left: index * el.clientWidth, behavior });
  }

  // Só avisa quando o scroll para, para ignorar as posições intermediárias.
  onScroll = () => {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const index = this.currentIndex();
      if (index !== this.props.index) {
        this.props.onChangeIndex(index);
      }
    }, 100);
  };

  render() {
    const { children, index } = this.props;

    return (
      <div className={styles.container} ref={this.ref} onScroll={this.onScroll}>
        {React.Children.map(children, (child, i) => (
          <div className={styles.slide} aria-hidden={i !== index}>
            {child}
          </div>
        ))}
      </div>
    );
  }
}

SwipeableViews.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  onChangeIndex: PropTypes.func.isRequired,
};

export default SwipeableViews;
