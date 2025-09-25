import React from 'react';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import hero1 from '../../assets/images/hero_1.jpg';
import hero2 from '../../assets/images/hero_2.jpg';
// import hero3 from '../../assets/images/hero_3.jpg';


const dataCarousel = [
  {
    image: hero1,
    subtitle: "SUMMER '21",
    title: 'Night Summer Dresses',
    position: 'left',
  },
  {
    image: hero2,
    subtitle: '50% OFF',
    title: 'New Cocktail Dresses',
    position: 'right',
  },
  // {
  //   image: hero3,
  //   subtitle: "SPRING/SUMMER '21",
  //   title: 'The Weekent Getaway',
  //   position: 'left',
  // },
];

const HomeCarousel = () => {
  return (
    <div>
      <Carousel
        autoPlay
        interval={5000}
        infiniteLoop
        showIndicators
        showArrows
        swipeable={false}
        showThumbs={false}
        showStatus={false}
        animationHandler='fade'
      >
        {dataCarousel.map((slide, index) => (
          <div className='carousel__slide' key={index}>
            <img src={slide.image} alt='' className='carousel__img' />
            <div
              className={`carousel__banner carousel__banner--${slide.position}`}
            >
              <div className='banner__subtitle'>{slide.subtitle}</div>
              <h2 className='banner__title'>{slide.title}</h2>
              <Button
                to='/shop'
                component={RouterLink}
                size='small'
                variant='outlined'
                color='secondary'
                className='banner__link'
              >
                Shop Now
              </Button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
