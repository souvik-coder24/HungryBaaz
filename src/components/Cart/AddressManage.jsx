import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeAddress } from '../../store/addressSlice'; 
import { FaTrashAlt } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';

const AddressManage = ({ addresses, onSelectAddress, onDeleteAddress }) => {
    const dispatch = useDispatch();
    
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleDeleteAddress = (index) => {
        dispatch(removeAddress(index));
        onDeleteAddress(index);
    };

    const handleSelectAddress = (index) => {
        setSelectedIndex(index);
        onSelectAddress(addresses[index]);
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
            <div className="container mx-auto flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Address</h2>
                    <div className="flex items-center space-x-3 mb-4">
                        <Link to="/newAddress">
                            <IoIosAddCircleOutline className="text-8xl text-blue-500 transition-transform duration-500 ease-in-out transform hover:scale-75  cursor-pointer"/>
                        </Link>
                        <span className="text-lg text-gray-700">Click to add a new address</span>
                    </div>
                </div>

                <div className="flex-1 w-full md:w-2/3 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Saved Addresses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {addresses.slice(0, 3).map((addr, index) => (
                            <div
                                key={index}
                                className={`p-4 border rounded-lg bg-gray-50 flex flex-col justify-between shadow-lg ${selectedIndex === index ? ' border-2 border-blue-500' : 'border-gray-200'}`}
                                onClick={() => handleSelectAddress(index)}
                            >
                                <div className="mb-4">
                                    <p className="mb-1 text-gray-700"><strong>Name:</strong> {addr.name}</p>
                                    <p className="mb-1 text-gray-700"><strong>Phone:</strong> {addr.phone}</p>
                                    <p className="mb-1 text-gray-700"><strong>Email:</strong> {addr.email}</p>
                                    <p className="mb-1 text-gray-700"><strong>House No:</strong> {addr.houseNo}</p>
                                    <p className="mb-1 text-gray-700"><strong>Landmark:</strong> {addr.landmark}</p>
                                    <p className="text-gray-700"><strong>Address:</strong> {addr.address}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAddress(index);
                                    }}
                                    className="mt-auto text-red-500 hover:text-red-700 transition duration-300"
                                >
                                    <FaTrashAlt className="text-lg" />
                                </button>
                            </div>
                        ))}
                        {addresses.length === 0 && (
                            <p className="text-gray-500 col-span-full">No addresses saved.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressManage;
