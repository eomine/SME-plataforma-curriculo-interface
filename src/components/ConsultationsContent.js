import Carousel from 'components/Carousel';
import styles from './ConsultationsContent.module.scss';
import { NavLink } from 'react-router-dom';
import createModalLink from 'utils/createModalLink';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import iconPlus from 'images/icons/plus1.svg';

class ConsutationsContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    const dateNow = Date.now();
    const consultations = this.props.consultations.filter(consultation => this.props.segment === consultation.segment);
    if(consultations.length) {
      return (
        <div>
          <Carousel>
          {consultations.map((consultation, index) => {
            let linkModal = createModalLink(`/consultas-publicas/${consultation.id}`);
            if (consultation.final_date > dateNow && consultation.initial_date < dateNow) {
              return(
                <div className={styles.consultationsWraper} key={index.toString()}>
                  <div>
                    <img className={styles.consultationsImage} alt="" src={consultation["cover_image"]}></img>
                    <p className={styles.name}>{consultation["title"]}</p>
                    <hr className={styles.carouselDivider}/>
                    <NavLink to={linkModal}>
                      <div className={styles.modalButton}>
                        <img alt="" src={iconPlus}></img>
                      </div>
                    </NavLink>
                  </div>
                </div>
              );
            }
            return null;
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
export default connect()(ConsutationsContent);
