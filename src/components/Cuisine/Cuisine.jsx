import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdStars } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { ShimmerSimpleGallery } from 'react-shimmer-effects';
import { IoClose } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setFilterValue } from '../../store/cartSlice';

const BASE_URL = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/';
const DEFAULT_LATITUDE = 22.5743545;
const DEFAULT_LONGITUDE = 88.3628734;
const DEFAULT_IMAGE = 'default_image.jpg';

const filterBtn = [
    { filtername: "Ratings 4.0+" },
    { filtername: "Offers" },
    { filtername: "Pure Veg" },
    { filtername: "New on HungryBaaz" },
    { filtername: "₹300 - ₹600" },
    { filtername: "Less than ₹300" },
];

const Cuisine = () => {
    const { description } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [visibleCount, setVisibleCount] = useState(16);
    const [loading, setLoading] = useState(true);
    const [activeBtn, setActiveBtn] = useState(null);
    const dispatch = useDispatch();

    const fetchRestaurantData = async (lat, lng, searchQuery) => {
        try {
            const response = await fetch(`/api/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=undefined&submitAction=ENTER&queryUniqueId=7abdce29-5ac6-7673-9156-302260e032f0&selectedPLTab=RESTAURANT`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const restaurants = data?.data?.cards[0]?.groupedCard?.cardGroupMap?.RESTAURANT?.cards || [];
            setRestaurants(restaurants);
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurantData(DEFAULT_LATITUDE, DEFAULT_LONGITUDE, description || '');
    }, [description]);

    useEffect(() => {
        dispatch(setFilterValue(activeBtn));
    }, [activeBtn, dispatch]);

    useEffect(() => {
        applyFilter();
    }, [restaurants, activeBtn]);

    const handleFilterBtn = (filtername) => {
        setActiveBtn(prev => (prev === filtername ? null : filtername));
    };

    const extractCost = (costString) => {
        const match = costString.match(/₹(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const applyFilter = () => {
        if (!restaurants.length) return;
        
        const filterData = restaurants.filter((item) => {
            if (!activeBtn) return true;

            const itemInfo = item?.card?.card?.info || {};
            const { avgRating, discountHeader, discountSubHeader, cuisines, costForTwoMessage } = itemInfo;

            switch (activeBtn) {
                case "Ratings 4.0+":
                    return avgRating > 4;
                case "Offers":
                    return discountHeader || discountSubHeader;
                case "Pure Veg":
                    return cuisines.includes("Salads");
                case "New on HungryBaaz":
                    return cuisines.includes("Snacks");
                case "₹300 - ₹600":
                    const price = extractCost(costForTwoMessage);
                    return price >= 300 && price <= 600;
                case "Less than ₹300":
                    const cost = extractCost(costForTwoMessage);
                    return cost < 300;
                default:
                    return true;
            }
        });

        setFilteredRestaurants(filterData);
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 16);
    };

    const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);

    return (
        <div className='w-full max-w-screen-xl mx-auto mt-16 px-4'>
            {loading ? (
                <ShimmerSimpleGallery card imageHeight={200} col={4} caption />
            ) : (
                <>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4'>
                        Restaurants related to <span className='text-blue-600'>{description || 'Cuisine'}</span> Cuisine
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
                    <div className="mb-2"><hr className="border-t-2 border-gray-300" /></div>

                    {visibleRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {visibleRestaurants.map((item, index) => {
                                const itemInfo = item?.card?.card?.info || {};
                                const { id, name, avgRating, sla, costForTwoMessage, areaName, slugs, cloudinaryImageId } = itemInfo;
                                const city = slugs?.city || '';
                                return (
                                    <Link key={id} to={`/res/${id}`} className="block relative transition-transform duration-300 hover:scale-105">
                                        <div className="bg-white p-2 rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={`${BASE_URL}${cloudinaryImageId || DEFAULT_IMAGE}`}
                                                alt={`Image ${index}`}
                                                loading="lazy"
                                                className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-md"
                                            />
                                            <div className="p-2">
                                                <h2 className='text-lg sm:text-xl md:text-2xl font-semibold'>{name}</h2>
                                                <p className='text-sm sm:text-base flex items-center gap-1 font-bold'>
                                                    <MdStars className='text-lg text-blue-600' />
                                                    {avgRating} <span>{sla?.slaString}</span>
                                                </p>
                                                <p className='text-sm sm:text-base text-gray-600 font-medium'>{costForTwoMessage}</p>
                                                <p className='text-sm sm:text-base text-gray-600'>{areaName}, {city}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No restaurants found.</p>
                    )}

                    {filteredRestaurants.length > visibleCount && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleLoadMore}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Cuisine;