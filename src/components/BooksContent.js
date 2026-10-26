import downloadIcon from 'images/icons/download.svg';
import Carousel from 'components/Carousel';
import styles from './BooksContent.module.scss';
import { connect } from 'react-redux';
import React, {Component} from 'react';

class BooksContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    const books = this.props.books.filter(book => this.props.year === book.year);
    if(books.length) {
      return (
        <div>
          <Carousel>
          {books.map((book, index) => {
            return(
              <div className={styles.bookWraper} key={index.toString()}>
                <img className={styles.bookImage} alt="" src={book["cover_image"]}></img>
                <p className={styles.name}>{book["name"]}</p>
                <hr className={styles.line}></hr>
                <a href={book["book_file"]} aria-label={`Baixar ${book["name"]}`}>
                  <div className={"row " + styles.downloadWrapper}>
                    <div className="col-10 pr-0 d-flex justify-content-start">
                      <span className={"align-self-center " + styles.componentName}>{book["curricular_component"]}</span>
                    </div>
                    <div className="col-2 pl-0 d-flex justify-content-end">
                      <img className={styles.file} alt="" src={downloadIcon}/>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
          </Carousel>
        </div>
      );
    } else {
      return(
        <div>
        </div>
      );
    }
  };
};
export default connect()(BooksContent);
