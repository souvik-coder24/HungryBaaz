import React, { useEffect, useState, useRef } from 'react';
import { Carousel, TopRestro, OnlineDelivery } from './index';
import { useSelector } from 'react-redux';
import ShimmerHome from './components/ShimmerEffect/ShimmerHome';

const BASE_URL = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/';
const DEFAULT_LATITUDE = 22.5743545;
const DEFAULT_LONGITUDE = 88.3628734;

const Body = ({ latitude, longitude }) => {
    const [images, setImages] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const sliderRef = useRef(null);

    const currentLatitude = latitude || DEFAULT_LATITUDE;
    const currentLongitude = longitude || DEFAULT_LONGITUDE;

    const buildApiUrl = (lat, lng) => 
        `/api/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

    const filterVal = useSelector((state) => state.cart.filterVal);

    const extractCost = (costStr) => {
        if (!costStr) return 0;
        const costMatch = costStr.match(/₹(\d+)/);
        return costMatch ? parseInt(costMatch[1], 10) : 0;
    };

    const filterData = restaurants.filter((item) => {
        if (!filterVal) return true;

        switch (filterVal) {
            case "Ratings 4.0+":
                return item?.rating > 4;
            case "Offers":
                return item?.discountHeader || item?.discountSubHeader;
            case "Pure Veg":
                return item?.cuisine.includes("Ice Cream");
            case "New on HungryBaaz":
                return item?.cuisine.includes("Bengali");
            case "₹300 - ₹600":
                const price = extractCost(item?.costForTwo);
                return price >= 300 && price <= 600;
            case "Less than ₹300":
                const cost = extractCost(item?.costForTwo);
                return cost < 300;
            default:
                return true;
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = buildApiUrl(currentLatitude, currentLongitude);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                const imageInfo = data?.data?.cards?.[0]?.card?.card?.imageGridCards?.info || [];
                const imageUrls = imageInfo.map(item => ({
                    imageUrl: `${BASE_URL}${item.imageId}`,
                    description: item.description || ''
                }));
                console.log("cuisine",imageUrls)
                setImages(imageUrls);

                const restaurantData = data?.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];

                if (Array.isArray(restaurantData)) {
                    const restaurantDetails = restaurantData.map(item => {
                        const imageId = item.info?.cloudinaryImageId;
                        const discountHeader = item.info?.aggregatedDiscountInfoV3?.header;
                        const discountSubHeader = item.info?.aggregatedDiscountInfoV3?.subHeader;
                        const id = item.info?.id;

                        return {
                            id,
                            imageUrl: `${BASE_URL}${imageId}`,
                            discountHeader,
                            discountSubHeader,
                            name: item.info?.name,
                            rating: item.info?.avgRating,
                            deliveryTime: item.info?.sla?.slaString,
                            cuisine: item.info?.cuisines?.join(', '),
                            location: item.info?.locality,
                            offers: item.info?.offers,
                            costForTwo: item.info?.costForTwo
                        };
                    }).filter(item => item.imageUrl);

                    setRestaurants(restaurantDetails);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentLatitude, currentLongitude]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className="w-[80%] mt-4 mx-auto mb-4">
            {loading ? (
                <ShimmerHome />
            ) : (
                <>
                    <Carousel images={images} />
                    <TopRestro restaurants={restaurants} sliderRef={sliderRef} />
                    <div className="mt-2"><hr /></div>
                    <OnlineDelivery restaurants={filterData} />
                </>
            )}
        </div>
    );
};

export default Body;
