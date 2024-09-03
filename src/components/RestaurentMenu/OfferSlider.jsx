import React, { useRef } from 'react';
import Slider from 'react-slick';

const OfferSlider = ({ discountData }) => {
    const sliderRef = useRef(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const truncatedTextStyle = {
        display: 'inline-block',
        maxWidth: '140px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    return (
        <div className="mx-auto mt-11 px-4 sm:px-6 lg:px-0">
            <h1 className='text-xl sm:text-2xl font-bold mb-4'>Discount Offers</h1>
            {discountData.length > 0 ? (
                <Slider ref={sliderRef} {...settings}>
                    {discountData.map((offer, index) => (
                        <div key={index} className="p-2">
                            <div className="border border-gray-400 p-2 rounded-lg flex flex-col sm:flex-row gap-2 items-center sm:items-start">
                                <img
                                    className='w-14 h-14 sm:w-20 sm:h-20 object-cover'
                                    src={"https://media-assets.swiggy.com/swiggy/image/upload/" + offer?.info?.offerLogo}
                                    alt="discount_logo"
                                />
                                <div className="flex-1 flex flex-col justify-center mt-4 items-center sm:items-start">
                                    <h2 className="text-xs sm:text-sm font-semibold text-center sm:text-left truncate">{offer?.info?.header}</h2>
                                    <p style={truncatedTextStyle} className="text-xs sm:text-sm text-gray-600 text-center sm:text-left mt-1 truncate">{offer?.info?.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p className="text-center text-gray-600">OOPS! Sorry, no discounts are available right now</p>
            )}
        </div>
    );
};

export default OfferSlider;