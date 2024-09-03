import React from 'react';
import construction from '../assets/Logo/construct.gif';
import { Link } from 'react-router-dom';

const Offer = () => {
  return (
    <div className="text-center mt-10 p-4 sm:p-6 md:p-8 lg:p-10">
      <img
        className="mx-auto mb-4 w-[60%] sm:w-[50%] md:w-[40%] lg:w-[35%] h-auto"
        src={construction}
        alt="Under construction"
      />
      <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-4">
        We are working on this page...
      </p>
      <Link to={'/'}>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[20%] mx-auto"
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default Offer;