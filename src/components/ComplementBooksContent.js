import downloadIcon from 'images/icons/download.svg';
import Carousel from 'components/Carousel';
import styles from './ComplementBooksContent.module.scss';
import { connect } from 'react-redux';
import React, {Component} from 'react';

class ComplementBooksContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    const books = this.props.complementBooks.filter(book => book["partner"].name === this.props.partner);
    if(books.length) {
      return (
        <div>
          <div><h3>{this.props.stage}</h3></div>
          <Carousel>
          {books.map((book, index) => {
            return(
              <div className={styles.bookWraper} key={index.toString()}>
                <img className={styles.bookImage} alt="" src={book["cover_image"]}></img>
                <ul className={styles.titleList}>
                  <li><span className={styles.componentName}>{book["name"]}</span></li>
                </ul>
                <span className={styles.name}>Autor(a): {book["author"]}</span>
                <hr className={styles.line}></hr>
                <div className={styles.fileWrapper}>
                  <a href={book["book_file"]}>
                    baixar material <img className={styles.file} alt="" src={downloadIcon}/>
                  </a>
                </div>
                <hr className={styles.line}></hr>
                <ul className={styles.componentList}>
                {book["complement_book_links"].map((link, idx) => {
                  return(
                    <a key={idx.toString()} target="_blank" rel="noopener noreferrer" href={link["link"]}><li className={styles.componentLink}>{"link " + (idx + 1)}</li></a>
                  );
                })}
                </ul>
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
export default connect()(ComplementBooksContent);
