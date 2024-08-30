import React, { useState, useEffect } from 'react';
import { IoSearch, IoChevronDown } from 'react-icons/io5';
import run from '../../config/gemini';
import RecipePopUp from '../Gemini/RecipePopUp';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';

const MenuSection = ({ menuData }) => {
    const [openMenu, setOpenMenu] = useState({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [recipeResult, setRecipeResult] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const cartInfo = useSelector((state) => state.cart.cartInfo);
    const dispatch = useDispatch();

    useEffect(() => {
        const initialOpenState = menuData.reduce((acc, item, index) => {
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

    const getItemCards = (item) => {
        return item.card?.card?.itemCards || item.card?.card?.categories?.flatMap(category => category.itemCards) || [];
    };

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
            toast.success("Item added to Cart")
            console.log("Item added to cart:", item);
        }
    };

    const filteredMenuData = menuData.filter(item => {
        const itemCards = getItemCards(item);
        return itemCards.some(card => card.card?.info?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    return (
        <div>
            <h2 className="text-center mt-16 leading-5 font-semibold text-gray-500">Menu</h2>

            <div className="w-full mt-6 relative">
                <input 
                    type="text"
                    placeholder="Search for dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full p-2 font-semibold bg-slate-200 text-gray-500 rounded-lg cursor-pointer text-center'
                />
                <IoSearch className='absolute top-3 right-5 text-gray-500'/>
            </div>

            <div className="m-8">
                {filteredMenuData.length > 0 ? (
                    filteredMenuData.slice(2, 8).map((item, index) => {
                        const itemCards = getItemCards(item);
                        return (
                            <div key={index} className="mb-4">
                                <div className='flex justify-between items-center'>
                                    <h1 className="font-semibold">{item.card?.card?.title} {itemCards.length ? ` (${itemCards.length})` : ``}</h1>
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

                                            return (
                                                <div key={subIndex} className="py-2 flex justify-between items-center border-b border-gray-200">
                                                    <div className='flex flex-col gap-2'>
                                                        <h2 className='font-semibold'>{name}</h2>
                                                        <p className='font-semibold text-sm'>₹ {price.toFixed(2)}</p>
                                                        <p className='text-sm text-slate-400'>{description}</p>
                                                        <div className='left-1 flex gap-4'>
                                                            <button 
                                                                className='p-2 bg-blue-500 rounded-lg text-[10px] text-white font-semibold transition-transform duration-500 ease-in-out transform hover:scale-95'
                                                                onClick={() => handleGetRecipe(name, description)}
                                                            >
                                                                Get Recipe
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAddToCart({ name, price, description, imageId })} 
                                                                className='p-2 bg-green-600 rounded-lg text-[10px] text-white font-semibold transition-transform duration-500 ease-in-out transform hover:scale-95'
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {imageId && (
                                                        <img 
                                                            className="w-36 h-36 rounded-xl object-cover transition-transform duration-500 ease-in-out transform hover:scale-110" 
                                                            src={`https://media-assets.swiggy.com/swiggy/image/upload/${imageId}`} 
                                                            alt="dish" 
                                                        />
                                                    )}
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
        </div>
    );
};

export default MenuSection;
