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
        arrows: false
    };

    return (
        <div className="mx-auto mt-11">
            <h1 className='text-2xl font-bold'>Discount Offers</h1>
            {discountData.length > 0 ? (
                <Slider ref={sliderRef} {...settings}>
                    {discountData.map((offer, index) => (
                        <div key={index} className="p-2 rounded-lg overflow-hidden">
                            <div className="border border-gray-400 p-4 rounded-lg flex gap-2">
                                <img className='w-12 h-12' src={"https://media-assets.swiggy.com/swiggy/image/upload/" + offer?.info?.offerLogo} alt="discount_logo" />
                                <div>
                                    <h2 className="text-lg font-semibold">{offer?.info?.header}</h2>
                                    <p className="text-sm text-gray-600">{offer?.info?.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>OOPS! Sorry, no discounts are available right now</p>
            )}
        </div>
    );
};

export default OfferSlider;
