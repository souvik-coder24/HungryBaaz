import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { IoIosArrowDown, IoIosHelpCircleOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Logo from '../../assets/Logo/HungryBaaz.png';
import { BiSolidOffer } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { toggleSignInSidebar } from '../../store/cartSlice';
import LoginSignUpSidebar from './LoginSignUpSidebar';
import SearchSidebar from './SearchSidebar';

const Header = ({ onLocationSelect }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.authSlice.userData);
    const [headerText, setHeaderText] = useState('Other');
    const [headerSubText, setHeaderSubText] = useState('');
    const [isSearchSidebarVisible, setIsSearchSidebarVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    const handleLocationSelect = (location) => {
        console.log('Location selected:', location);
        if (onLocationSelect) {
            onLocationSelect(location);
        }
    };

    const updateHeaderText = (formattedAddress) => {
        console.log("Updating header with address:", formattedAddress);

        if (!formattedAddress) {
            console.error('Received invalid address:', formattedAddress);
            setHeaderText('Other');
            setHeaderSubText('');
            return;
        }

        const parts = formattedAddress.split(', ');
        const city = parts[0] || '';
        const rest = parts.slice(1).join(', ') || '';

        setHeaderText(city);
        setHeaderSubText(rest);
    };

    const toggleSearchSidebar = () => {
        setIsSearchSidebarVisible(!isSearchSidebarVisible);
    };

    const navItems = [
        { name: "Search", path: "/search", image: <FaSearch size={24} /> },
        { name: "Offers", path: "/offers", image: <BiSolidOffer size={24} /> },
        { name: "Help", path: "/help", image: <IoIosHelpCircleOutline size={24} /> },
        { name: "Cart", path: "/cart", image: <FaCartShopping size={24} /> }
    ];

    return (
        <div>
            <LoginSignUpSidebar />
            <SearchSidebar 
                isSidebarVisible={isSearchSidebarVisible} 
                onLocationSelect={handleLocationSelect} 
                onHeaderUpdate={updateHeaderText}
                onClose={() => setIsSearchSidebarVisible(false)} 
                />

                {/* Desktop Navigation */}
                <div className='desktop-header fixed top-0 left-0 w-full h-16 bg-white shadow-lg flex justify-between items-center z-20 px-4'>
                    <div className='flex items-center'>
                        <Link to='/'>
                            <img className='w-16 transition-transform duration-300 ease-in-out transform hover:scale-95 cursor-pointer' src={Logo} alt="logo" />
                        </Link>
                        <div className='flex items-center ml-4 cursor-pointer' onClick={toggleSearchSidebar}>
                            <div className='font-bold flex flex-col items-start'>
                                <h4>{headerText}</h4>
                                <p className='text-xs text-gray-400'>{headerSubText}</p>
                            </div>
                            <IoIosArrowDown size={16} style={{ color: '#00B7EB' }} />
                        </div>
                    </div>
                
                    <div className='flex items-center gap-8'>
                        {navItems.map((item, index) => (
                            <Link to={item.path} key={index}>
                                <div className="flex items-center gap-2 cursor-pointer group relative">
                                    <div className="text-gray-500 group-hover:text-[#00B7EB] transition-colors">
                                        {item.image}
                                    </div>
                                    <p className="text-lg font-normal text-gray-500 group-hover:text-[#00B7EB] transition-colors">{item.name}</p>
                                </div>
                            </Link>
                        ))}
                        <div className="flex items-center gap-2 cursor-pointer group relative" onClick={() => dispatch(toggleSignInSidebar())}>
                            {userData && userData.photo ? (
                                <img
                                    src={userData.photo}
                                    alt="User"
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <CiUser size={24} className="text-gray-500 group-hover:text-[#00B7EB] transition-colors" />
                            )}
                            <p className="text-lg font-normal text-gray-500 group-hover:text-[#00B7EB] transition-colors">
                                {userData ? userData.name : 'Sign In'}
                            </p>
                        </div>
                    </div>
                </div>
            {/* Top Header for Mobile and Tablet */}
            <div className=' top-bar fixed top-0 left-0 w-full h-16 bg-white shadow-lg justify-between items-center z-20 px-4'
            top>
                <Link to='/'>
                    <img className='w-16 transition-transform duration-300 ease-in-out transform hover:scale-95 cursor-pointer' src={Logo} alt="logo" />
                </Link>
                <div className='flex items-center ml-4 flex-grow cursor-pointer' onClick={toggleSearchSidebar}>
                    <div className='font-bold flex flex-col items-start'>
                        <h5>{headerText}</h5>
                        <p className='text-xs text-gray-400'>{headerSubText}</p>
                    </div>
                    <IoIosArrowDown size={16} style={{ color: '#00B7EB' }} />
                </div>
                <div className="flex items-center ml-auto cursor-pointer" onClick={() => dispatch(toggleSignInSidebar())}>
                    {userData && userData.photo ? (
                        <img
                            src={userData.photo}
                            alt="User"
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <CiUser size={24} className="text-gray-500 group-hover:text-[#00B7EB] transition-colors" />
                    )}
                </div>
            </div> 


        {/*Bottom Navbar*/}
        <div className='bottom-bar'>
            {navItems.map((item, index) => (
                <Link to={item.path} key={index}>
                    <div className={`icon-container mt-3 ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => handleClick(index)}>
                        <div className="text transition-colors">
                            {item.image}
                        </div>
                    </div>
                </Link>
            ))}
        </div>

            {/* Content */}
            <div className="pt-5">
                <Outlet />
            </div>
        </div>
    );
};

export default Header;