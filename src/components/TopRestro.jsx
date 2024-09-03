import React, { useRef } from 'react';
import Slider from 'react-slick';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdStars } from "react-icons/md";
import { Link } from 'react-router-dom';

const TopRestro = ({ restaurants }) => {
    const sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 8000,
        arrows: false,
        centerMode: false,
        centerPadding: '0',
        swipeToSlide: true,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                    centerMode: false,
                    centerPadding: '10px',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: false,
                    centerMode: false,
                    centerPadding: '10px',
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: true,
                    centerMode: false,
                    centerPadding: '0',
                }
            },
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    arrows: true,
                    centerMode: false,
                    centerPadding: '0',
                }
            }
        ]
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
        <div className="mx-auto mt-9 px-4 sm:px-6 lg:px-8">
            <div className='flex flex-col sm:flex-row justify-between items-center'>
                <h1 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-0'>Top Band For You</h1>
                <div className='flex gap-4'>
                    <FaArrowLeft 
                        className='hidden md:flex bg-gray-200 text-4xl rounded-full text-gray-700 cursor-pointer p-2'
                        onClick={handlePrevClick}
                    />
                    <FaArrowRight 
                        className='hidden md:flex bg-gray-200 text-4xl rounded-full text-gray-700 cursor-pointer p-2'
                        onClick={handleNextClick}
                    />
                </div>
            </div>
            {restaurants.length > 0 ? (
                <Slider ref={sliderRef} {...settings}>
                    {restaurants.map((item, index) => (
                        <Link key={item.id} to={`/res/${item.id}`}>
                            <div className="relative p-2 transition-transform duration-500 ease-in-out transform hover:scale-95 cursor-pointer">
                                <div className="bg-white rounded-lg overflow-hidden relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={`Image ${index}`}
                                        loading="lazy"
                                        className="w-full h-[182px] object-cover rounded-lg"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
                                        <div className="flex flex-col items-start">
                                            <p className='text-lg font-bold'>
                                                {item.discountHeader}
                                            </p>
                                            <p className='text-lg font-bold'>
                                                {item.discountSubHeader}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <h2 className='text-lg font-bold'>{item.name}</h2>
                                    <p className='text-sm flex items-center gap-1'>
                                        <MdStars className='text-lg text-blue-600' />
                                        {item.rating} <span className='font-semibold'>{item.deliveryTime}</span>
                                    </p>
                                    <p className='text-sm font-semibold text-gray-600'>{item.cuisine}</p>
                                    <p className='text-sm font-semibold text-gray-600'>{item.location}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </Slider>
            ) : (
                <p>No images available</p>
            )}
        </div>
    );
}

export default TopRestro;