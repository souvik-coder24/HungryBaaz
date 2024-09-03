import React, { useState, useEffect } from 'react';
import { IoSearch, IoChevronDown } from 'react-icons/io5';
import { MdStars } from 'react-icons/md';
import run from '../../config/gemini';
import RecipePopUp from '../Gemini/RecipePopUp';
import AddonsPopup from './AddonsPopup';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';

const MenuSection = ({ menuData }) => {
    const [openMenu, setOpenMenu] = useState({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isAddonsPopupOpen, setIsAddonsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [recipeResult, setRecipeResult] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const initialOpenState = menuData.reduce((acc, _, index) => {
            acc[index] = true;
            return acc;
        }, {});
        setOpenMenu(initialOpenState);
    }, [menuData]);

    const toggleMenu = (index) => {
        setOpenMenu(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleGetRecipe = async (name, description) => {
        setIsPopupOpen(true);
        try {
            const result = await run(`Give me recipe for "${name}" with the description: "${description}".`);
            setRecipeResult(result);
        } catch (error) {
            console.error('Error fetching recipe:', error);
            setRecipeResult('Sorry, we could not fetch the recipe at this time.');
        }
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleAddToCart = (item) => {
        const itemWithAddons = { ...item, addons: item.addons || [] };
    
        const currentCart = JSON.parse(localStorage.getItem('cartInfo')) || [];
    
        const isItemInCart = currentCart.some(cartItem => cartItem.id === itemWithAddons.id);
    
        if (isItemInCart) {
            toast.error(`${item.name} is already in the cart`);
            return;
        }
    
        if (itemWithAddons.addons.length > 0) {
            setSelectedItem(itemWithAddons);
            setIsAddonsPopupOpen(true);
        } else {
            dispatch(addToCart(itemWithAddons));
            toast.success(`${item.name} added to Cart`);
    
            currentCart.push(itemWithAddons);
            localStorage.setItem('cartInfo', JSON.stringify(currentCart));
        }
    };

    const closeAddonsPopup = () => {
        setIsAddonsPopupOpen(false);
    };

    const getItemCards = (item) => {
        return item.card?.card?.itemCards || item.card?.card?.categories?.flatMap(category => category.itemCards) || [];
    };

    const filteredMenuData = menuData.filter(item => {
        const itemCards = getItemCards(item);
        return itemCards.some(card => card.card?.info?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-center mt-16 leading-5 font-semibold text-gray-500 text-lg sm:text-xl lg:text-2xl">Menu</h2>

            <Link to={'/search'}>
                <div className="w-full mt-6 relative">
                    <input 
                        type="text"
                        placeholder="Search for dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full p-2 font-semibold bg-slate-200 text-gray-500 outline-none rounded-lg cursor-pointer text-center'
                    />
                    <IoSearch className='absolute top-3 right-5 text-gray-500'/>
                </div>
            </Link>

            <div className="mt-6">
                {filteredMenuData.length > 0 ? (
                    filteredMenuData.slice(0, 8).map((item, index) => {
                        const itemCards = getItemCards(item);
                        return (
                            <div key={index} className="mb-4">
                                <div className='flex justify-between items-center'>
                                    <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl">{item.card?.card?.title} {itemCards.length ? ` (${itemCards.length})` : ``}</h1>
                                    <IoChevronDown
                                        className={`text-2xl cursor-pointer transition-transform duration-300 ${openMenu[index] ? 'rotate-180' : ''}`}
                                        onClick={() => toggleMenu(index)}
                                    />
                                </div>
                                {openMenu[index] && (
                                    <div className="mt-2 pl-4">
                                        {itemCards.map((itemCard, subIndex) => {
                                            const price = (Number(itemCard?.card?.info?.price) || Number(itemCard?.card?.info?.defaultPrice)) / 100;
                                            const name = itemCard?.card?.info?.name;
                                            const description = itemCard?.card?.info?.description;
                                            const imageId = itemCard?.card?.info?.imageId;
                                            const rating = itemCard?.card?.info?.ratings?.aggregatedRating?.rating || '';
                                            const ratingCount = itemCard?.card?.info?.ratings?.aggregatedRating?.ratingCountV2 || '0';

                                            return (
                                                <div key={subIndex} className="py-2 flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 w-full">
                                                    <div className="flex flex-col sm:flex-row-reverse w-full">
                                                        {imageId && (
                                                            <img 
                                                                className="w-72 sm:w-36 lg:w-46 h-auto rounded-xl object-cover transition-transform duration-500 ease-in-out transform hover:scale-110 mb-4 sm:mb-0 sm:order-1"
                                                                src={`https://media-assets.swiggy.com/swiggy/image/upload/${imageId}`} 
                                                                alt="dish" 
                                                            />
                                                        )}
                                                        <div className='flex-1 sm:order-2 flex flex-col justify-between w-full'>
                                                            <h2 className='font-semibold text-base'>{name}</h2>
                                                            <div className='text-sm text-gray-600 flex gap-2 items-center'>
                                                                <MdStars className='text-lg text-blue-600' />
                                                                <div className="flex">
                                                                    {rating} ({ratingCount})
                                                                </div>
                                                            </div>
                                                            <p className='font-semibold text-sm'>₹ {Math.floor(price)}</p>
                                                            <p 
                                                                className={`text-sm text-slate-400 cursor-pointer hidden md:block`}
                                                                onClick={() => setExpandedIndex(expandedIndex === subIndex ? null : subIndex)}
                                                            >
                                                                {description}
                                                            </p>
                                                            <div className='flex gap-4 mt-2'>
                                                                <button 
                                                                    className='p-2 bg-blue-500 rounded-lg text-xs text-white font-semibold transition-transform duration-500 ease-in-out transform hover:scale-95'
                                                                    onClick={() => handleGetRecipe(name, description)}
                                                                >
                                                                    Get Recipe
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleAddToCart({ ...itemCard?.card?.info, price, name, description, imageId })} 
                                                                    className='p-2 bg-green-600 rounded-lg text-xs text-white font-semibold transition-transform duration-500 ease-in-out transform hover:scale-95'
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <hr className='my-5 border-gray-300'/>
                            </div>
                        );
                    })
                ) : (
                    <p>Loading....</p>
                )}
            </div>
            <RecipePopUp isOpen={isPopupOpen} onClose={closePopup} result={recipeResult} />
            {isAddonsPopupOpen && selectedItem && (
                <AddonsPopup item={selectedItem} onClose={closeAddonsPopup} />
            )}
        </div>
    );
};

export default MenuSection;