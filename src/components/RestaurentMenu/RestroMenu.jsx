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
            console.log("resInfo",result?.data?.cards[2]?.card?.card?.info || {})
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
    if (error) return <p>Error: {error}</p>;

    const enrichedText = resinfo?.feeDetails?.message?.replace(/<[^>]*>/g, "") || '';
    const hasEnrichedText = enrichedText.length > 0;

    return (
        <div className='mt-20 w-full'>
            <div className='w-[800px] mx-auto'>
                <p className='text-[13px] text-slate-600'>
                    <Link to={"/"}>
                        <span className='text-slate-600 hover:text-slate-800 hover:underline cursor-pointer'>Home</span>
                    </Link>
                    {' / '}
                    <Link to={'/'}><span className='text-slate-600 hover:text-slate-800 hover:underline cursor-pointer'>{resinfo.city}</span></Link>
                    {' / '}
                    <span className='text-slate-600'>{resinfo.name}</span>
                </p>
                <h1 className="font-bold text-3xl pt-6">{resinfo.name}</h1>
                <div className="w-full h-[226px] mt-3 rounded-3xl px-4 pb-4 bg-gradient-to-t from-slate-400/30">
                    <div className="w-full border border-slate-400 rounded-3xl h-full bg-white p-4">
                        <div className='flex items-center gap-1 font-semibold'>
                            <MdStars className='text-lg text-blue-600' />
                            <span>{resinfo.avgRating || 'Rating'}</span>
                            <span>({resinfo.totalRatingsString || 'Total Ratings'})</span>
                            .
                            <span>{resinfo.costForTwoMessage || 'Cost for Two'}</span>
                        </div>
                        <p className='underline text-yellow-700 text-sm'>{resinfo?.cuisines?.join(", ") || 'Cuisines'}</p>
                        <div className='flex gap-2 mt-4'>
                            <div className='w-[9px] flex flex-col justify-center items-center mt-1'>
                                <div className='w-[7px] h-[7px] bg-gray-500 rounded-full'></div>
                                <div className="w-[2px] h-[23px] bg-gray-500"></div>
                                <div className='w-[7px] h-[7px] bg-gray-500 rounded-full'></div>
                            </div>
                            <div className='flex flex-col gap-3 text-sm font-semibold'>
                                <p>Outlet <span className='text-gray-400'>{resinfo.locality || 'Locality'}</span></p>
                                <p>{resinfo.sla?.slaString || 'Not Disclose'}</p>
                            </div>
                        </div>
                        <div className='mt-5'><hr /></div>
                        <div className="p-2 text-2xl flex items-center">
                            {hasEnrichedText ? (
                                <>
                                    <MdDeliveryDining className='text-3xl text-gray-700' />
                                    <span className='ml-2 text-sm text-gray-400'>{enrichedText}</span>
                                </>
                            ) : (
                                <>
                                    <MdDeliveryDining className='text-3xl text-gray-700' />
                                    <span className='ml-2 text-sm text-gray-400'>No delivery Charges will Apply</span>
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
