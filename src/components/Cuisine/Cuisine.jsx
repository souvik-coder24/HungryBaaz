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

    return (
        <div className='w-[80%] mt-16 ml-[200px]'>
            {loading ? (
                <ShimmerSimpleGallery card imageHeight={200} col={4} caption />
            ) : (
                <>
                    <h1 className='text-2xl font-bold mb-4'>
                        Restaurants related to <span className='text-blue-600 text-3xl'>{description || 'Cuisine'}</span> Cuisine
                    </h1>
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
                    <div className="mb-2"><hr className="border-t-2 border-gray-300" /></div>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredRestaurants.map((item, index) => {
                                const itemInfo = item?.card?.card?.info || {};
                                const { id, name, avgRating, sla, costForTwoMessage, areaName, slugs, cloudinaryImageId, aggregatedDiscountInfoV2, aggregatedDiscountInfoV3 } = itemInfo;
                                const city = slugs?.city || '';
                                const discountHeader = aggregatedDiscountInfoV3?.header || (aggregatedDiscountInfoV2?.header?.includes("New on HungryBaaz") ? "New on HungryBaaz" : "");
                                const discountSubHeader = aggregatedDiscountInfoV3?.subHeader || '';

                                return (
                                    <Link key={id} to={`/res/${id}`}>
                                        <div className="mt-2 px-2 relative transition-transform duration-500 ease-in-out transform hover:scale-95 cursor-pointer">
                                            <div className="bg-white p-1 rounded-lg overflow-hidden min-w-[295px] h-[182px] relative">
                                                <img
                                                    src={`${BASE_URL}${cloudinaryImageId || DEFAULT_IMAGE}`}
                                                    alt={`Image ${index}`}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute bottom-0 left-1 w-[97.5%] p-2 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
                                                    <div className="flex items-start">
                                                        <p className='text-2xl font-bold'>{discountHeader}</p>
                                                        <p className='text-2xl font-bold'>{discountSubHeader}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='ml-1 mt-3'>
                                                <h2 className='text-2xl font-bold'>{name}</h2>
                                                <p className='text-sm flex items-center gap-1'>
                                                    <MdStars className='text-lg text-blue-600' />
                                                    {avgRating} <span className='font-semibold'>{sla?.slaString}</span>
                                                </p>
                                                <p className='text-md font-semibold text-gray-600'>{costForTwoMessage}</p>
                                                <p className='text-md font-semibold text-gray-600'>{areaName}, {city}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No restaurants found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Cuisine;
