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
        <div className="mx-auto mt-9">
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Top Band For You</h1>
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
            {restaurants.length > 0 ? (
                <Slider ref={sliderRef} {...settings}>
                    {restaurants.map((item, index) => (
                        <Link key={item.id} to={`/res/${item.id}`}>
                        <div key={index} className="mt-2 px-2 relative transition-transform duration-500 ease-in-out transform hover:scale-95 cursor-pointer">
                            <div className="bg-white p-1 rounded-lg overflow-hidden min-w-[295px] h-[182px] relative">
                                <img
                                    src={item.imageUrl}
                                    alt={`Image ${index}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute bottom-0 left-1 w-[97.5%] p-2 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
                                    <div className="flex items-center">
                                        <p className='text-2xl font-bold'>
                                            {item.discountHeader}
                                        </p>
                                        <p className='text-2xl font-bold'>
                                            {item.discountSubHeader}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='ml-1 mt-3'>
                                <h2 className='text-2xl font-bold'>{item.name}</h2>
                                <p className='text-sm flex items-center gap-1'>
                                    <MdStars className='text-lg text-blue-600' />
                                    {item.rating} <span className='font-semibold'>{item.deliveryTime}</span>
                                </p>
                                <p className='text-md font-semibold text-gray-600'>{item.cuisine}</p>
                                <p className='text-md font-semibold text-gray-600'>{item.location}</p>
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
