import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCartInfo, removeFromCart, updateQuantity, toggleSignInSidebar } from '../../store/cartSlice';
import empty from '../../assets/Logo/chat.gif';
import { Link } from 'react-router-dom';
import AddressManage from './AddressManage';
import toast from 'react-hot-toast';
import { FaTrashAlt } from 'react-icons/fa';

const Cart = () => {
    const cartInfo = useSelector((state) => state.cart.cartInfo);
    const dispatch = useDispatch();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const userData = useSelector((state) => state.authSlice.userData);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cartInfo')) || [];
        dispatch(setCartInfo(savedCart));

        try {
            const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
            setAddresses(savedAddresses);
        } catch (error) {
            console.error("Failed to parse addresses from localStorage:", error);
            localStorage.removeItem('addresses');
        }
    }, [dispatch]);

    const handleRemoveItem = (index) => {
        dispatch(removeFromCart(index));
        const updatedCart = cartInfo.filter((_, i) => i !== index);
        localStorage.setItem('cartInfo', JSON.stringify(updatedCart));
    };

    const handleUpdateQuantity = (index, amount) => {
        dispatch(updateQuantity({ index, amount }));
        const updatedCart = cartInfo.map((item, i) => {
            if (i === index) {
                const newQuantity = Math.max(1, (item.quantity || 1) + amount);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        localStorage.setItem('cartInfo', JSON.stringify(updatedCart));
    };

    const handleRemoveAddon = (itemIndex, addonId) => {
        const updatedCart = cartInfo.map((item, i) => {
            if (i === itemIndex) {
                const updatedAddons = item.addons.map(group => ({
                    ...group,
                    choices: group.choices.filter(choice => choice.id !== addonId)
                }));
                return { ...item, addons: updatedAddons };
            }
            return item;
        });

        dispatch(setCartInfo(updatedCart));
        localStorage.setItem('cartInfo', JSON.stringify(updatedCart));
    };

    const handleSaveAddress = (address) => {
        try {
            const newAddresses = [...addresses, address].slice(0, 3);
            localStorage.setItem('addresses', JSON.stringify(newAddresses));
            setAddresses(newAddresses);
        } catch (error) {
            console.error("Failed to save address to localStorage:", error);
        }
    };

    const handleDeleteAddress = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        toast.success("Address Successfully Removed!");
        setAddresses(updatedAddresses);
        if (selectedAddress === addresses[index]) {
            setSelectedAddress(null);
        }
    };

    const handleCheckout = () => {
        if (!userData) {
            dispatch(toggleSignInSidebar());
            toast.error("Kindly Login First");
            return;
        }
        if (!selectedAddress) {
            toast.error("Please select a shipping address before proceeding to checkout.");
            return;
        }
        toast.success("Thank You! Order Placed Successfully");
    };

    const calculateTotalPrice = (item) => {
        const addons = item.addons || [];
        const addonsPrice = addons.flatMap(group => group.choices || [])
            .filter(choice => choice)
            .reduce((total, choice) => total + (choice.price / 100), 0);

        return item.price + addonsPrice;
    };

    const totalPrice = cartInfo.reduce((total, item) => {
        const price = calculateTotalPrice(item);
        const quantity = item.quantity || 1;
        return total + price * quantity;
    }, 0);

    return (
        <div className="h-screen mt-10 py-2">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {cartInfo.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-3/4">
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 overflow-y-auto max-h-[400px]">
                                <table className="w-full text-sm md:text-base">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-semibold">Product</th>
                                            <th className="text-left font-semibold hidden md:table-cell">Price</th>
                                            <th className="text-center font-semibold">Quantity</th>
                                            <th className="text-left font-semibold hidden md:table-cell">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartInfo.map((item, itemIndex) => (
                                            <tr key={itemIndex} className="border-t border-gray-200">
                                                <td className="py-4">
                                                    <div className="flex flex-col md:flex-row items-center">
                                                        <img
                                                            className="w-28 h-28 sm:w-28 sm:h-28 mb-2 md:mb-0 md:mr-4 rounded"
                                                            src={`https://media-assets.swiggy.com/swiggy/image/upload/${item.imageId}`}
                                                            alt={item.name}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-sm md:text-base">{item.name}</span>
                                                            <span className="text-xs md:text-sm text-gray-400 truncate max-w-[200px]">{item.description}</span>
                                                            {item.addons && item.addons.length > 0 && (
                                                                <div className="mt-2">
                                                                    {item.addons.map((group, groupIndex) => (
                                                                        <div key={groupIndex} className="mt-1">
                                                                            {group.choices.map((choice, choiceIndex) => (
                                                                                <div key={choiceIndex} className="flex items-center text-xs md:text-sm text-gray-600">
                                                                                    <span>{choice.name} - ₹{(choice.price)/100}</span>
                                                                                    <FaTrashAlt onClick={() => handleRemoveAddon(itemIndex, choice.id)}
                                                                                        className="ml-4 text-red-500 hover:text-red-700 cursor-pointer"/>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 hidden md:table-cell">₹{Math.floor(item.price)}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => {
                                                                const currentQuantity = item.quantity || 1;
                                                                if (currentQuantity <= 1) {
                                                                    handleRemoveItem(itemIndex);
                                                                } else {
                                                                    handleUpdateQuantity(itemIndex, -1);
                                                                }
                                                            }}
                                                            className="border rounded-md py-1 px-2 mr-1 text-xs md:text-sm bg-gray-200"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-center w-8">{item.quantity || 1}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(itemIndex, 1)}
                                                            className="border rounded-md py-1 px-2 ml-1 text-xs md:text-sm bg-gray-200"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 pl-2 md:table-cell">₹{Math.floor(calculateTotalPrice(item) * (item.quantity || 1))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="md:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                                <div className="flex justify-between text-xs md:text-sm mb-2">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm mb-2">
                                    <span>Taxes (6%)</span>
                                    <span>₹{(totalPrice * 0.06).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm mb-2">
                                    <span>Platform fee</span>
                                    <span>₹6.00</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm mb-2">
                                    <span>Shipping</span>
                                    <span>₹0.00</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-xs md:text-sm mb-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">₹{Math.floor(totalPrice * 0.06 + totalPrice + 6).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm mb-2">
                                    <span>Discount</span>
                                    <span>- ₹{(totalPrice * 0.02).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm mb-2">
                                    <span className="font-semibold">After Discount</span>
                                    <span className="font-semibold">₹{Math.round((totalPrice * 0.06 + totalPrice + 6) - (totalPrice * 0.02)).toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <button onClick={handleCheckout} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full text-sm">
                                        Checkout
                                    </button>
                                    <Link to={'/'}>
                                        <p className="text-xs mt-2 text-gray-600 cursor-pointer">Or, Continue Shopping</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <img className="mx-auto mb-4 w-72 h-72" src={empty} alt="empty gif" />
                        <p className="text-xl md:text-2xl text-gray-600">It appears your cart is empty. Browse our selection to add your favorite items.</p>
                        <Link to={'/'}>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                )}
                
                {cartInfo.length > 0 && (
                    <div className="mt-2">
                        <AddressManage
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            onSelectAddress={setSelectedAddress}
                            onSaveAddress={handleSaveAddress}
                            onDeleteAddress={handleDeleteAddress}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;