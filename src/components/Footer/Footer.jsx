import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from '../../assets/Logo/FooterLogo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-8 mx-auto w-[81%] rounded-xl shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Logo and Branding */}
          <div className="mb-6 md:mb-0">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-46 mb-2" />
            </Link>
            <p className="text-gray-700">Delivering your favorite food with a smile.</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row md:gap-8 mb-6 md:mb-0">
            <div className="flex flex-col">
              <h5 className="text-lg font-semibold mb-2">Company</h5>
              <Link to="/about" className="text-gray-600 hover:text-black mb-1">About Us</Link>
              <Link to="/contact" className="text-gray-600 hover:text-black mb-1">Contact</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-black mb-1">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-black">Terms of Service</Link>
            </div>
            <div className="flex flex-col">
              <h5 className="text-lg font-semibold mb-2">Support</h5>
              <Link to="/faq" className="text-gray-600 hover:text-black mb-1">FAQ</Link>
              <Link to="/returns" className="text-gray-600 hover:text-black mb-1">Returns</Link>
              <Link to="/shipping" className="text-gray-600 hover:text-black">Shipping Information</Link>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-6 md:mb-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 mx-auto text-center">
          <h5 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h5>
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="p-2 w-64 rounded-l-md border border-gray-400 bg-white text-black"
            />
            <button
              type="submit"
              className="p-2 bg-blue-400 text-white rounded-r-md hover:bg-blue-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Legal Information */}
      <div className="border-t border-gray-400 mt-8 pt-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} HungryBaaz. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
