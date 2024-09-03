import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

const calculateAddonsPrice = (item, selectedAddons) => {
    return selectedAddons.reduce((total, id) => {
        const choice = item.addons.flatMap(group => group.choices).find(choice => choice.id === id);
        const choicePrice = choice && typeof choice.price === 'number' ? choice.price : 0;
        return total + (choicePrice / 100); // Convert price to main unit (e.g., rupees)
    }, 0);
};

const AddonsPopup = ({ item, onClose }) => {
    const [selectedAddons, setSelectedAddons] = useState([]);
    const dispatch = useDispatch();
    const popupRef = useRef(null);
    const cartInfo = useSelector((state) => state.cart.cartInfo);

    const handleAddonChange = (addonId) => {
        setSelectedAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const calculateTotalPrice = () => {
        const totalAddonsPrice = calculateAddonsPrice(item, selectedAddons);
        const basePrice = item.price && typeof item.price === 'number' ? item.price : 0;
        return basePrice + totalAddonsPrice;
    };

    const handleConfirm = () => {
        const basePrice = item.price && typeof item.price === 'number' ? item.price : 0;
        const totalAddonsPrice = calculateAddonsPrice(item, selectedAddons);
        const updatedPrice = basePrice + totalAddonsPrice;

        if (selectedAddons.length === 0) {
            dispatch(addToCart({ ...item, addons: [], updatedPrice }));
            localStorage.setItem('cartInfo', JSON.stringify([
                ...cartInfo,
                { ...item, addons: [], updatedPrice }
            ]));
            toast.success("Item added to Cart without addons");
        } else {
            const addons = item.addons.map(group => ({
                choices: group.choices.filter(choice => selectedAddons.includes(choice.id) && typeof choice.price === 'number')
            }));

            dispatch(addToCart({ ...item, addons, updatedPrice }));
            localStorage.setItem('cartInfo', JSON.stringify([
                ...cartInfo,
                { ...item, addons, updatedPrice }
            ]));

            toast.success("Item added to Cart with selected addons");
        }
        
        onClose();
    };

    const handleOutsideClick = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
            <div
                ref={popupRef}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            >
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <h2 className="text-xl font-semibold truncate">Select Addons for {item.name}</h2>
                    <IoClose
                        className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        onClick={onClose}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {item.addons && item.addons.length > 0 ? (
                        item.addons.map((group, groupIndex) => (
                            <div key={groupIndex} className="mb-4">
                                <h3 className="font-semibold text-lg">{group.groupName}</h3>
                                {group.choices.filter(choice => typeof choice.price === 'number').map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`addon-${choice.id}`}
                                            checked={selectedAddons.includes(choice.id)}
                                            onChange={() => handleAddonChange(choice.id)}
                                            className="form-checkbox h-6 w-6 text-green-600 rounded-full cursor-pointer"
                                        />
                                        <label htmlFor={`addon-${choice.id}`} className="ml-2 text-sm">
                                            {choice.name} - ₹{(choice.price / 100).toFixed(2)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No addons available</p>
                    )}
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-2">
                    <p className="font-semibold text-lg">
                        Total Price: ₹{calculateTotalPrice().toFixed(2)}
                    </p>
                    <button
                        onClick={handleConfirm}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddonsPopup;