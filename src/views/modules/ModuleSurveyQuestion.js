import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModuleSurveyQuestion.module.scss';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

class ModuleSurveyQuestion extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      rating: 5
    };
  }

  // Clicar na estrela já marcada não zera a nota.
  onRatingChange = (event, nextValue) => {
    if (nextValue !== null) {
      this.setState({rating: nextValue});
    }
  };

  render() {

    const { rating } = this.state;

    let commentContent = null
    let ratingContent = null

    if (this.props.haveComment === "true") {
      commentContent = (
        <div className={styles.comment}>
          <h3>Comentário:</h3>
          <textarea></textarea>
        </div>
      );
    } else {
      commentContent = <div></div>
    }

    if (this.props.haveRating === "true") {
      ratingContent = (
        <div className={styles.rating}>
          <h3>Avaliação: {rating}</h3>
          <Rating
            name="rate1"
            max={10}
            value={rating}
            onChange={this.onRatingChange}
            emptyIcon={<StarIcon fontSize="inherit" style={{ color: '#333' }} />}
            />
        </div>
      );
    } else {
      ratingContent = <div></div>
    }

    return (
      <div>
        <h2>Questão {this.props.sequence}</h2>
        <div className={styles.contentArea}></div>
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: this.props.text }} />
          <div>
            {ratingContent}
          </div>
          <div>
            {commentContent}
          </div>
        </div>
      </div>
    );
  }
}

ModuleSurveyQuestion.propTypes = {
  text: PropTypes.string.isRequired,
  sequence: PropTypes.string.isRequired,
  haveComment: PropTypes.string.isRequired,
  requiredComment: PropTypes.string.isRequired,
  haveRating: PropTypes.string.isRequired,
  requiredRating: PropTypes.string.isRequired,
};

export default ModuleSurveyQuestion;
