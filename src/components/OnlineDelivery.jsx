import React, { useState, useEffect } from 'react';
import { MdStars } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilterValue } from '../store/cartSlice';

const OnlineDelivery = ({ restaurants }) => {
    const filterBtn = [
        { filtername: "Ratings 4.0+" },
        { filtername: "Offers" },
        { filtername: "Pure Veg" },
        { filtername: "New on HungryBaaz" },
        { filtername: "₹300 - ₹600" },
        { filtername: "Less than ₹300" },
    ];

    const [activeBtn, setActiveBtn] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilterValue(activeBtn));
    }, [activeBtn, dispatch]);

    const handleFilterBtn = (filtername) => {
        setActiveBtn(prev => (prev === filtername ? null : filtername));
    };

    return (
        <div className='mt-8 px-4'>
            <h1 className='text-2xl md:text-3xl font-bold'>
                Restaurants with online food delivery
            </h1>
            <div className="my-7 flex flex-wrap gap-3">
                {filterBtn.map((btn) => (
                    <button
                        key={btn.filtername}
                        onClick={() => handleFilterBtn(btn.filtername)}
                        className={`filterBtn flex gap-2 items-center ${activeBtn === btn.filtername ? "active" : ""}`}
                    >
                        <p className='text-sm md:text-base'>{btn.filtername}</p>
                        {activeBtn === btn.filtername && <IoClose className='close-icon text-xl' />}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {restaurants.length > 0 ? (
                    restaurants.map((item, index) => (
                        <Link key={item.id} to={`/res/${item.id}`}>
                            <div className="relative transition-transform duration-500 ease-in-out transform hover:scale-95 cursor-pointer">
                                <div className="bg-white p-2 rounded-lg overflow-hidden relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={`Image ${index}`}
                                        loading="lazy"
                                        className="w-full h-[200px] object-cover rounded-lg"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
                                        <div className="flex gap-2">
                                            <p className='text-lg md:text-xl font-bold'>
                                                {item.discountHeader}
                                            </p>
                                            <p className='text-md md:text-lg font-bold'>
                                                {item.discountSubHeader}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='ml-2 mt-3'>
                                    <h2 className='text-lg md:text-xl font-bold'>{item.name}</h2>
                                    <p className='text-sm md:text-base flex items-center gap-1'>
                                        <MdStars className='text-lg text-blue-600' />
                                        {item.rating} <span className='font-semibold'>{item.deliveryTime}</span>
                                    </p>
                                    <p className='text-sm md:text-base font-semibold text-gray-600'>{item.cuisine}</p>
                                    <p className='text-sm md:text-base font-semibold text-gray-600'>{item.location}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className='text-center col-span-full'>No restaurants available</p>
                )}
            </div>
        </div>
    );
}

export default OnlineDelivery;