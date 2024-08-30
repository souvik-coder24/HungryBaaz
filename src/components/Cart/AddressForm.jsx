import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress } from '../../store/addressSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AddressForm = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.addresses.addresses || []);
  
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    email: '',
    houseNo: '',
    landmark: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(address).forEach(key => {
      if (!address[key].trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      if (addresses.length >= 2) {
        toast.error('You can only save up to 2 addresses.');
        return;
      }
      dispatch(addAddress(address));
      setAddress({
        name: '',
        phone: '',
        email: '',
        houseNo: '',
        landmark: '',
        address: ''
      });
      toast.success('Address saved successfully');
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Address</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={address.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="houseNo"
              value={address.houseNo}
              onChange={handleChange}
              placeholder="House No"
              required
              className={`w-full p-3 border rounded-lg ${errors.houseNo ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.houseNo && <p className="text-red-500 text-sm mt-1">{errors.houseNo}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="landmark"
              value={address.landmark}
              onChange={handleChange}
              placeholder="Landmark"
              required
              className={`w-full p-3 border rounded-lg ${errors.landmark ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.landmark && <p className="text-red-500 text-sm mt-1">{errors.landmark}</p>}
          </div>
          <div className="form-group col-span-2">
            <textarea
              name="address"
              value={address.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          <div className="col-span-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Save Address
            </button>
            <Link to={'/cart'}>
              <h2 className="text-blue-500 hover:text-blue-700 mt-4">Go to Cart</h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
