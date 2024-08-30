import React, { useRef } from 'react';
import Slider from 'react-slick';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import featuredImages from '../Data/Homefeatured.json';

const Carousel = ({ images }) => {
    const sliderRef = useRef(null);
    const featuredSliderRef = useRef(null);

    const featuredSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: false,
        fade: true,
        cssEase: 'linear',
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 8000,
        arrows: false,
        centerMode: false,
        centerPadding: '0',
        swipeToSlide: true,
        focusOnSelect: true,
    };

    const handlePrevClick = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const handleNextClick = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    return (
        <div className='w-full'>
            <div className='relative mt-16'>
                <Slider ref={featuredSliderRef} {...featuredSettings}>
                    {featuredImages.length > 0 ? (
                        featuredImages.map(item => (
                            <Link key={item.index} to={`/cuisine/${item.description}`}>
                                <div className="w-full overflow-hidden rounded-lg">
                                    <img 
                                        src={item.image} 
                                        loading="lazy"
                                        alt={`Featured ${item.id}`}
                                        style={{ width: '100%', height: '50%', objectFit: 'cover' }}
                                        className="transition-transform rounded-2xl duration-500 ease-in-out mt-4 transform hover:scale-105 cursor-pointer"
                                    />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No featured images available</p>
                    )}
                </Slider>
            </div>

            <div className="mx-auto mt-11">
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold'>Feed Your Culinary Curiosity</h1>
                    <div className='flex gap-6'>
                        <FaArrowLeft 
                            className='bg-gray-200 text-2xl rounded-full text-gray-700 cursor-pointer'
                            onClick={handlePrevClick}
                        />
                        <FaArrowRight 
                            className='bg-gray-200 text-2xl rounded-full text-gray-700 cursor-pointer'
                            onClick={handleNextClick}
                        />
                    </div>
                </div>

                {images.length > 0 ? (
                    <Slider ref={sliderRef} {...settings}>
                        {images.map((imageUrl, index) => (
                            <Link key={index} to={`/cuisine/${imageUrl.description}`}>
                                <div className="p-2 rounded-lg overflow-hidden">
                                    <img
                                        src={imageUrl.imageUrl}
                                        alt={`Image ${index}`} 
                                        loading="lazy"
                                        style={{ width: '100%', height: 'auto' }} 
                                        className="rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-125 cursor-pointer"
                                    />
                                </div>
                            </Link>
                        ))}
                    </Slider>
                ) : (
                    <p>No images available</p>
                )}
            </div>
        </div>
    );
}

export default Carousel;
