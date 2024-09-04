import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdStars, MdDeliveryDining } from 'react-icons/md';
import OfferSlider from './OfferSlider';
import MenuSection from './MenuSection';
import ShimmerMenu from '../ShimmerEffect/ShimmerMenu';

const RestroMenu = () => {
    const { id } = useParams();
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resinfo, setResInfo] = useState({});
    const [discountData, setDiscountData] = useState([]);

    async function fetchMenuData(restaurantId) {
        try {
            const response = await fetch(`/api/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=18.9690247&lng=72.8205292&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            setResInfo(result?.data?.cards[2]?.card?.card?.info || {});
            const fetchedMenuData = result?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];
            setMenuData(fetchedMenuData);
            setDiscountData(result?.data?.cards[3]?.card?.card?.gridElements?.infoWithStyle?.offers || []);
        } catch (error) {
            console.error("Error fetching menu data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchMenuData(id);
        } else {
            setError("Restaurant ID is not provided");
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    if (loading) return <ShimmerMenu />;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    const enrichedText = resinfo?.feeDetails?.message?.replace(/<[^>]*>/g, "") || '';
    const hasEnrichedText = enrichedText.length > 0;

    return (
        <div className='mt-16 w-full px-4 sm:px-6 lg:px-8'>
            <div className='max-w-screen-lg mx-auto'>
                <p className='text-xs sm:text-sm text-slate-600'>
                    <Link to={"/"}>
                        <span className='text-slate-600 hover:text-slate-800 hover:underline cursor-pointer'>Home</span>
                    </Link>
                    {' / '}
                    <Link to={'/'}><span className='text-slate-600 hover:text-slate-800 hover:underline cursor-pointer'>{resinfo.city}</span></Link>
                    {' / '}
                    <span className='text-slate-600'>{resinfo.name}</span>
                </p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold pt-4">{resinfo.name}</h1>
                <div className="w-full h-auto mt-3 rounded-xl px-4 pb-4 bg-gradient-to-t from-slate-400/30">
                    <div className="w-full border border-slate-400 rounded-xl h-auto bg-white p-4">
                        <div className='flex items-center gap-2 font-semibold'>
                            <MdStars className='text-lg sm:text-xl text-blue-600' />
                            <span className='text-sm sm:text-base'>{resinfo.avgRating || 'Rating'}</span>
                            <span className='text-sm sm:text-base'>({resinfo.totalRatingsString || ''})</span>
                            <span className='text-sm sm:text-base'>{resinfo.costForTwoMessage || ''}</span>
                        </div>
                        <p className='underline text-yellow-700 text-xs sm:text-sm'>{resinfo?.cuisines?.join(", ") || ''}</p>
                        <div className='flex gap-2 mt-4'>
                            <div className='w-3 flex flex-col justify-center items-center mt-1'>
                                <div className='w-2 h-2 bg-gray-500 rounded-full'></div>
                                <div className="w-[3px] h-6 bg-gray-500"></div>
                                <div className='w-2 h-2 bg-gray-500 rounded-full'></div>
                            </div>
                            <div className='flex flex-col gap-2 text-xs sm:text-sm font-semibold'>
                                <p>Outlet <span className='text-gray-400'>{resinfo.locality || ''}</span></p>
                                <p>{resinfo.sla?.slaString || 'Not Disclosed'}</p>
                            </div>
                        </div>
                        <div className='mt-4'><hr /></div>
                        <div className="p-2 text-xl flex items-center">
                            {hasEnrichedText ? (
                                <>
                                    <MdDeliveryDining className='text-2xl sm:text-3xl text-gray-700' />
                                    <span className='ml-2 text-xs sm:text-sm text-gray-400'>{enrichedText}</span>
                                </>
                            ) : (
                                <>
                                    <MdDeliveryDining className='text-2xl sm:text-3xl text-gray-700' />
                                    <span className='ml-2 text-xs sm:text-sm text-gray-400'>No delivery charges will apply</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <OfferSlider discountData={discountData} />

                <MenuSection menuData={menuData} />
            </div>
        </div>
    );
};

export default RestroMenu;