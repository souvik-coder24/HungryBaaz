import React from 'react'
import construction from '../assets/Logo/construct.gif'
import { Link } from 'react-router-dom'

const Offer = () => {
  return (
    <div className="text-center">
      <img className="mx-auto mb-4 w-[35%] h-[35%]" src={construction} alt="empty gif" />
      <p className="text-2xl text-gray-600 cursor-pointer">We are wroking on this page.. </p>
        <Link to={'/'}>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-[20%]">
              Continue Shopping
          </button>
        </Link>
    </div>
  )
}

export default Offer