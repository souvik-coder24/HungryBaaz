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
        <>
            <div className='mt-8'>
                <h1 className='text-2xl font-bold'>Restaurants with online food delivery</h1>
                <div className="my-7 flex gap-3">
                    {
                        filterBtn.map((btn) => (
                            <button
                                key={btn.filtername}
                                onClick={() => handleFilterBtn(btn.filtername)}
                                className={`filterBtn flex gap-2 items-center ${activeBtn === btn.filtername ? "active" : ""}`}
                            >
                                <p>{btn.filtername}</p>
                                {activeBtn === btn.filtername && <IoClose className='close-icon mt-1' />}
                            </button>
                        ))
                    }
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {restaurants.length > 0 ? (
                        restaurants.map((item, index) => (
                            <Link key={item.id} to={`/res/${item.id}`}>
                                <div className="mt-2 px-2 relative transition-transform duration-500 ease-in-out transform hover:scale-95 cursor-pointer">
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
                        ))
                    ) : (
                        <p>No restaurants available</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default OnlineDelivery;
