import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCartInfo, removeFromCart, updateQuantity, toggleSignInSidebar } from '../../store/cartSlice';
import empty from '../../assets/Logo/chat.gif';
import { Link } from 'react-router-dom';
import AddressManage from './AddressManage';
import toast from 'react-hot-toast';

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
        toast.success("Order Placed");
    };

    const totalPrice = cartInfo.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = item.quantity || 1;
        return total + price * quantity;
    }, 0);

    return (
        <div className="h-screen mt-10 py-8 ">
            <div className="container mx-auto px-4">
                {cartInfo.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-3/4">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-semibold">Product</th>
                                            <th className="text-left font-semibold">Price</th>
                                            <th className="text-left font-semibold">Quantity</th>
                                            <th className="text-left font-semibold">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartInfo.map((item, index) => (
                                            <tr key={index}>
                                                <td className="py-4">
                                                    <div className="flex items-center">
                                                        <img
                                                            className="h-16 w-16 mr-4 rounded"
                                                            src={`https://media-assets.swiggy.com/swiggy/image/upload/${item.imageId}`}
                                                            alt={item.name}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{item.name}</span>
                                                            <span className="text-sm text-gray-400 truncate max-w-[200px]">{item.description}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">₹{item.price}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => {
                                                                const currentQuantity = item.quantity || 1;
                                                                if (currentQuantity <= 1) {
                                                                    handleRemoveItem(index);
                                                                } else {
                                                                    handleUpdateQuantity(index, -1);
                                                                }
                                                            }}
                                                            className="border rounded-md py-2 px-4 mr-2"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-center w-8">{item.quantity || 1}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(index, 1)}
                                                            className="border rounded-md py-2 px-4 ml-2"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="md:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Taxes</span>
                                    <span>₹{(totalPrice * 0.06).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Shipping</span>
                                    <span>₹0.00</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">₹{(totalPrice * 1.03).toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <button onClick={handleCheckout} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">
                                        Checkout
                                    </button>
                                    <Link to={'/'}>
                                        <p className="text-sm mt-2 text-gray-600 cursor-pointer">Or, Continue Shopping</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <img className="mx-auto mb-4 w-72 h-72" src={empty} alt="empty gif" />
                        <p className="text-2xl text-gray-600">It appears your cart is empty. Browse our selection to add your favorite items.</p>
                        <Link to={'/'}>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                )}
                
                {cartInfo.length > 0 && (
                    <div className="mt-8">
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
