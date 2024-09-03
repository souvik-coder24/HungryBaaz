import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import logo from '../assets/Logo/HungryBaaz.png';
import noimage from '../assets/Logo/noimage.svg';
import searchImg from '../assets/Logo/seach.gif';
import { MdStars } from "react-icons/md";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Search({ latitude, longitude }) {
    const BASE_URL = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/';
    const DEFAULT_LATITUDE = 22.5743545;
    const DEFAULT_LONGITUDE = 88.3628734;

    const lat = latitude || DEFAULT_LATITUDE;
    const lng = longitude || DEFAULT_LONGITUDE;

    const [searchQuery, setSearchQuery] = useState("");
    const [dishes, setDishes] = useState([]);
    const [restroData, setRestroData] = useState([]);
    const [activeBtn, setActiveBtn] = useState("Dishes");

    const cartInfo = useSelector((state) => state.cart.cartInfo);
    const dispatch = useDispatch();

    const filterBtn = [
        { filtername: "Restaurant" },
        { filtername: "Dishes" },
    ];

    const handleFilterBtn = (filtername) => {
        setActiveBtn((prev) => (prev === filtername ? "" : filtername));
    };

    const fetchDishes = async (lat, lng) => {
        try {
            const response = await fetch(`/api/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=48336a39e-ca12-654d-dc3b-2af9d645f8d7&submitAction=ENTER&queryUniqueId=7abdce29-5ac6-7673-9156-302260e032f0`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const fetchedDishes = data?.data?.cards[1]?.groupedCard?.cardGroupMap?.DISH?.cards || [];
            const formattedDishes = fetchedDishes.filter((item) => item?.card?.card?.info);
            setDishes(formattedDishes);
        } catch (error) {
            console.error("Error fetching dishes:", error);
        }
    };

    const fetchRestaurantData = async (lat, lng) => {
        try {
            const response = await fetch(`/api/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=undefined&submitAction=ENTER&queryUniqueId=7abdce29-5ac6-7673-9156-302260e032f0&selectedPLTab=RESTAURANT`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const restaurants = data?.data?.cards[0]?.groupedCard?.cardGroupMap?.RESTAURANT?.cards || [];
            setRestroData(restaurants);
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    };

    useEffect(() => {
        fetchDishes(lat, lng);
        fetchRestaurantData(lat, lng);
    }, [searchQuery, lat, lng]);

    const handleAddToCart = (item) => {
        const isAdded = cartInfo.some(cartItem =>
            cartItem.name === item.name &&
            cartItem.price === item.price &&
            cartItem.description === item.description &&
            cartItem.imageId === item.imageId
        );

        if (isAdded) {
            toast.error("Item already added to cart");
        } else {
            dispatch(addToCart(item));
            localStorage.setItem('cartInfo', JSON.stringify([...cartInfo, item]));
            toast.success("Item added to Cart");
        }
    };

    return (
        <div className='mt-16 mx-auto px-4 sm:px-6 lg:px-8'>
            <div className="relative mb-8">
                <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border-2 bg-gray-300 border-gray-400 py-3 focus:outline-none rounded-md w-full'
                    type="text"
                    placeholder='Search for restaurants and food'
                />
            </div>
            <div className="my-7 flex flex-wrap gap-3">
                {filterBtn.map((btn) => (
                    <button
                        key={btn.filtername}
                        onClick={() => handleFilterBtn(btn.filtername)}
                        className={`filterBtn flex items-center px-4 py-2 rounded-md ${activeBtn === btn.filtername ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        {btn.filtername}
                    </button>
                ))}
            </div>

            <div className="relative">
                <div className="flex flex-wrap gap-6">
                    {/*----------------------------- Dishes------------------------------------- */}
                    {activeBtn === "Dishes" && (
                        <div className="w-full space-y-6">
                            <h2 className="text-xl font-semibold">Dishes:</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {dishes.length > 0 ? (
                                    dishes.map((item, index) => {
                                        const itemInfo = item?.card?.card || {};
                                        const name = itemInfo?.info?.name;
                                        const price = (Number(itemInfo?.info?.price) / 100).toFixed(2);
                                        const description = itemInfo?.info?.description;
                                        const imageId = itemInfo?.info?.imageId;

                                        return (
                                            <div key={index} className="bg-white p-4 rounded-md shadow-lg flex items-center">
                                                <div className="flex-grow">
                                                    <h4 className="text-sm font-bold">By {itemInfo?.restaurant?.info?.name}</h4>
                                                    <div className="flex gap-2 text-gray-600 mb-2">
                                                        <div className="flex gap-1">
                                                            <MdStars className="text-yellow-400 text-xl mt-1"/>
                                                            <p className="text-[12px] font-bold mt-1">{itemInfo?.restaurant?.info?.avgRating}</p>
                                                        </div>
                                                        <div className="flex mt-1 gap-2">
                                                            <p className="text-[12px] font-bold">({itemInfo?.restaurant?.info?.totalRatingsString})</p>
                                                            <p className="text-[12px] font-bold">{itemInfo?.restaurant?.info?.sla?.slaString}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h2 className="text-[10px] font-bold mb-2">{name}</h2>
                                                            <div className="flex items-center mb-2">
                                                                <MdStars className="text-yellow-400 text-[10px]"/>
                                                                <p className="text-gray-600 ml-1 font-bold text-[10px]">{itemInfo?.info?.ratings?.aggregatedRating?.rating}</p>
                                                                <p className="ml-1 text-gray-500 font-bold text-[10px]">({itemInfo?.info?.ratings?.aggregatedRating?.ratingCountV2})</p>
                                                            </div>
                                                            <p className="text-gray-600 font-bold text-[10px]">₹ {price}</p>
                                                            <button
                                                                onClick={() => handleAddToCart({ name, price, description, imageId })}
                                                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-transform duration-500 ease-in-out transform hover:scale-95 cursor-pointer"
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </div>    
                                                        <img
                                                            src={imageId ? `${BASE_URL}${imageId}` : noimage}
                                                            alt="item-image"
                                                            className="w-32 h-32 rounded-md object-cover mt-4 md:mt-0 md:ml-4"
                                                        />  
                                                    </div> 
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <img src={searchImg} alt="Search" className="w-24 h-24 md:w-32 md:h-32" />
                                        <p className="text-center mt-2">No dishes found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/*------------------------------- Restaurants--------------------------- */}
                    {activeBtn === "Restaurant" && (
                        <div className="w-full space-y-6">
                            <h2 className="text-xl font-semibold">Restaurants:</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {restroData.length > 0 ? (
                                    restroData.map((item) => {
                                        const itemInfo = item?.card?.card?.info || {};

                                        return (
                                            <Link key={itemInfo.id} to={`/res/${itemInfo.id}`}>
                                                <div className="flex bg-white p-4 rounded-md shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-95 cursor-pointer">
                                                    <div className="flex-grow">
                                                        <h2 className="text-md font-semibold">{itemInfo?.name}</h2>
                                                        <div className="flex gap-2 text-gray-600">
                                                            <div className="flex gap-1">
                                                                <MdStars className="text-yellow-400 text-lg"/>
                                                                <p className="text-[12px] mt-1 font-bold">{itemInfo?.avgRating}</p>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <p className="text-[12px] mt-1 font-bold">{itemInfo?.sla?.slaString}</p>
                                                                <p className="text-[12px] mt-1 font-bold">{itemInfo?.costForTwoMessage}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <p className="text-[10px] mt-1 font-bold">{itemInfo?.areaName}</p>
                                                            <p className="text-[10px] mt-1 font-bold">{itemInfo?.slugs?.city}</p>
                                                        </div>
                                                    </div>
                                                    <img
                                                        src={`${BASE_URL}${itemInfo?.cloudinaryImageId || logo}`}
                                                        alt="restaurant-image"
                                                        className="w-32 h-32 rounded-md object-cover ml-4"
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <img src={searchImg} alt="Search" className="w-24 h-24 md:w-32 md:h-32" />
                                        <p className="text-center mt-2">No restaurants found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}