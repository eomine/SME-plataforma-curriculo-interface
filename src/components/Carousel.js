import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import { isMobile } from 'react-device-detect';
import chevronLeft from 'images/chevrons/left.svg';
import chevronRight from 'images/chevrons/right.svg';
import styles from './Carousel.module.scss';

// Carrossel de cards com setas fora da área dos cards: 5 por vez no desktop
// (em loop) e 1 por vez no celular.
export default function Carousel({ children }) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const slides = React.Children.toArray(children);
  const cardsPerView = isMobile ? 1 : 5;

  return (
    <div className={styles.carousel}>
      <Swiper
        modules={[Navigation]}
        slidesPerView={cardsPerView}
        spaceBetween={12}
        loop={!isMobile && slides.length > cardsPerView}
        navigation={{ prevEl, nextEl }}
      >
        {slides.map(slide => (
          <SwiperSlide key={slide.key}>{slide}</SwiperSlide>
        ))}
      </Swiper>
      <button ref={setPrevEl} className={`${styles.chevron} ${styles.prev}`} aria-label="Anterior">
        <img alt="" src={chevronLeft} />
      </button>
      <button ref={setNextEl} className={`${styles.chevron} ${styles.next}`} aria-label="Próximo">
        <img alt="" src={chevronRight} />
      </button>
    </div>
  );
}

Carousel.propTypes = {
  children: PropTypes.node,
};
