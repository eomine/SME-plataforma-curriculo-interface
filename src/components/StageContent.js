import { connect } from 'react-redux';
import React, {Component} from 'react';
import YearContent from './YearContent';
import styles from './StageContent.module.scss'
import { API_URL } from 'data/constants';

function onlyUnique(value, index, self) {
    if (value === undefined) {
      return false
    }
    return self.indexOf(value) === index;
}

class StageContent extends Component {
  constructor(props) {
    super(props);

    this.state ={
      stages: [],
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(API_URL + "/api/stages")
      .then(response => response.json())
      .then(data => this.setState({ stages: data }))
  }

  render() {
    const stages = this.props.books
      .filter(book => this.props.segment === book.segment)
      .map(book => book.stage)
      .filter(onlyUnique).sort();

    const stageBooks = this.state.stages.filter(stage => stages.includes(stage.name)).map(stage => stage.name).filter(onlyUnique)

    return(
      <div className="container">
        {stageBooks.map((stage, index) => {
          return(
            <div key={index} >
              <h3 className={styles.stageName}>{stage}</h3>
              <YearContent stage={stage} books={this.props.books} segment={this.props.segment}></YearContent>
            </div>
          );
        })}
      </div>
    );
  }
};
export default connect()(StageContent);
