import chevronRight from 'images/chevrons/right.svg';
import chevronLeft from 'images/chevrons/left.svg';
import downloadIcon from 'images/icons/download.svg';
import ItemsCarousel from 'react-items-carousel';
import styles from './BooksContent.module.scss';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';

function checkDevice() {
  return isMobile ? (true) : (false);
}

function totalCards() {
  if(checkDevice()){
    return 1;
  }else {
    return 5;
  }
}

class BooksContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      activeItemIndex: 0
    };
  }

  render() {
    const books = this.props.books.filter(book => this.props.year === book.year);
    if(books.length) {
      return (
        <div>
          <ItemsCarousel
          infiniteLoop={!checkDevice()}
          gutter={12}
          activePosition={'center'}
          chevronWidth={60}
          disableSwipe={false}
          alwaysShowChevrons={false}
          numberOfCards={totalCards()}
          slidesToScroll={1}
          outsideChevron={true}
          showSlither={false}
          firstAndLastGutter={false}
          activeItemIndex={this.state.activeItemIndex}
          requestToChangeActive={value => this.setState({ activeItemIndex: value })}
          rightChevron={
            <button aria-label="Próximo">
            <img alt="" src={chevronRight}/>
            </button>
          }
          leftChevron={
            <button aria-label="Anterior">
            <img alt="" src={chevronLeft}/>
            </button>
          }
          >
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
          </ItemsCarousel>
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
