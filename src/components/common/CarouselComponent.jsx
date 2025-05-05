import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../styles/Carousel.css';

 // Add this for additional layout fixes

const images = [
  {
    src: 'https://localhost:7234/images/jar.jpg',
    alt: 'Storage Jar',
  },
  {
    src: 'https://localhost:7234/images/phone.jpg',
    alt: 'Smartphone',
  },
  {
    src: 'https://localhost:7234/images/monitor.jpg',
    alt: 'Monitor Display',
  },
  {
    src: 'https://localhost:7234/images/rings.jpg',
    alt: 'Jewelry Rings',
  },
];

const CarouselComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img.src}
              alt={img.alt}
              className="carousel-image"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarouselComponent;
