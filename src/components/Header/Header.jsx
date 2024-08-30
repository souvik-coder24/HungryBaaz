import React, { useState, useEffect } from 'react';
import Logo from '../../assets/Logo/HungryBaaz.png';
import { CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { BiSolidOffer } from "react-icons/bi";
import { IoIosArrowDown, IoIosHelpCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Link, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleSignInSidebar } from '../../store/cartSlice';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../Firebase/auth';
import { addUserData, removeuserData } from '../../store/authSlice';
import { FcGoogle } from "react-icons/fc";
import lost from '../../assets/Logo/lost.gif';

const Header = ({ onLocationSelect }) => {
    const dispatch = useDispatch();
    const { isSidebarVisible, cartInfo, isSignInSidebarVisible } = useSelector((state) => state.cart);
    const userData = useSelector((state) => state.authSlice.userData);

    const [searchResult, setSearchResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [updateMainPlace, setUpdateMainPlace] = useState('Others');
    const [updateSubPlace, setUpdateSubPlace] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const fetchSearchResults = async (query) => {
        if (!query) {
            setSearchResult([]);
            return;
        }

        try {
            const response = await fetch(`/api/dapi/misc/place-autocomplete?input=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            setSearchResult(result.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getPlaceData = async (placeId) => {
        console.log('Fetching place data for:', placeId);
        try {
            const response = await fetch(`/api/dapi/misc/address-recommend?place_id=${placeId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            const place = result?.data?.[0];
            const latitude = place?.geometry?.location?.lat;
            const longitude = place?.geometry?.location?.lng;
            const mainText = place?.structured_formatting?.main_text;
            const secondaryText = place?.structured_formatting?.secondary_text;

            console.log('Place data:', { latitude, longitude, mainText, secondaryText });

            if (latitude && longitude) {
                onLocationSelect({ latitude, longitude });
                setUpdateMainPlace(prev => mainText || prev);
                setUpdateSubPlace(prev => secondaryText || prev);
            }
        } catch (error) {
            console.error('Error fetching place data:', error);
        }
    };

    const handleItemClick = (placeId, mainText, secondaryText) => {
        getPlaceData(placeId);
        setUpdateMainPlace(mainText);
        setUpdateSubPlace(secondaryText);
        dispatch(toggleSidebar());
    };

    const handleSignIn = async () => {
        try {
            const data = await signInWithPopup(auth, provider);
            const userData = {
                name: data.user.displayName,
                photo: data.user.photoURL
            };
            dispatch(addUserData(userData));
            dispatch(toggleSignInSidebar());
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(removeuserData());
            dispatch(toggleSignInSidebar());
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleToggleSignUp = () => {
        setIsSignUp(!isSignUp);
    };

    const handleGoogleSignIn = async () => {
        try {
            await handleSignIn();
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsSignUp(false);
        } catch (error) {
            console.error("Error registering:", error);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log('User after login:', user);
            if (user) {
                const userData = {
                    name: user.displayName || 'Guest',
                    photo: user.photoURL || ''
                };
                dispatch(addUserData(userData));
                console.log('User data dispatched:', userData);
            }
            dispatch(toggleSignInSidebar());
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const truncatedTextStyle = {
        display: 'inline-block',
        maxWidth: '150px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    useEffect(() => {
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        } else {
            setSearchResult([]);
        }
    }, [searchQuery]);

    const navItems = [
        { name: "Search", path: "/search", image: <CiSearch size={24} /> },
        { name: "Offers", path: "/offers", image: <BiSolidOffer size={24} /> },
        { name: "Help", path: "/help", image: <IoIosHelpCircleOutline size={24} /> },
        { name: "Cart", path: "/cart", image: <CiShoppingCart size={24} /> }
    ];

    return (
        <div className="relative">
            {/* Searchbar Content */}
            <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isSidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
            <div className={`fixed top-0 left-0 w-[30%] h-full bg-white z-40 transition-transform duration-300 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                <IoClose className='text-2xl absolute top-4 right-4 cursor-pointer' onClick={() => dispatch(toggleSidebar())} />
                <div className='p-4 mt-16'>
                    <input 
                        type="text" 
                        className='border rounded-lg p-2 w-full focus:outline-none hover:shadow-lg' 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className='mt-2'>
                        {searchResult.length > 0 ? (
                            <ul className='border border-gray-400 rounded-lg'>
                                {searchResult.map((data, index) => (
                                    <li 
                                        key={index} 
                                        className='py-2 px-4 cursor-pointer border-b border-gray-300 hover:bg-gray-100' 
                                        onClick={() => handleItemClick(
                                            data.place_id,
                                            data.structured_formatting?.main_text,
                                            data.structured_formatting?.secondary_text
                                        )}
                                    >
                                        <h4 className='font-semibold hover:text-blue-600'>{data.structured_formatting?.main_text}</h4> 
                                        <p className="text-sm opacity-65">{data.structured_formatting?.secondary_text}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center py-8">
                                <img src={lost} alt="No results" className="w-[60%] h-[60%]"/>
                                <p className="text-gray-600 text-2xl mt-4">Help me to Find a Location!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sign-In/Sign-Up Section */}
            <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isSignInSidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
            <div className={`fixed top-0 right-0 w-[30%] h-full bg-white z-50 transition-transform duration-300 ${isSignInSidebarVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                <IoClose className='text-2xl absolute top-4 right-4 cursor-pointer' onClick={() => dispatch(toggleSignInSidebar())} />
                <div className='p-4 mt-16'>
                    <h2 className='text-2xl font-bold mb-4'>{isSignUp ? 'Register' : 'Log-In'}</h2>
                    <div className='flex flex-col items-center gap-4 mb-6'>
                        {userData && userData.photo ? (
                            <img src={userData.photo} alt={userData.name} className="w-12 h-12 rounded-full" />
                        ) : (
                            <CiUser size={48} className="text-gray-500" />
                        )}
                        <div className='w-full max-w-sm'>
                            <p className="text-lg text-center font-bold mb-2">{userData ? userData.name : 'Guest'}</p>
                            {!userData ? (
                                <div className="flex flex-col gap-4 mb-4">
                                    {isSignUp ? (
                                        <>
                                            <input 
                                                type="text" 
                                                placeholder='Name' 
                                                className='border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <input 
                                                type="text" 
                                                placeholder='Email' 
                                                className='border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <input 
                                                type="password" 
                                                placeholder='Password' 
                                                className='border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button 
                                                onClick={handleRegister}
                                                className='bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700'
                                            >
                                                Register
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <input 
                                                type="text" 
                                                placeholder='Email or Phone' 
                                                className='border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <input 
                                                type="password" 
                                                placeholder='Password' 
                                                className='border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button 
                                                onClick={handleLogin}
                                                className='bg-blue-400 border border-gray-400 py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white'
                                            >
                                                LogIn
                                            </button>
                                        </>
                                    )}
                                    <p className='text-sm text-center mt-4'>
                                        {isSignUp ? (
                                            <>
                                                Already have an account? 
                                                <button 
                                                    onClick={handleToggleSignUp}
                                                    className='text-blue-600 hover:underline'
                                                >
                                                    LogIn
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                Don't have an account? 
                                                <button 
                                                    onClick={handleToggleSignUp}
                                                    className='text-blue-600 hover:underline'
                                                >
                                                    Register
                                                </button>
                                            </>
                                        )}
                                    </p>
                                    <div className="text-center flex flex-col mt-1 justify-center items-center ">
                                        <p className='text-sm text-gray-500'>or</p>
                                        <button 
                                            onClick={handleGoogleSignIn}
                                            className='bg-white border border-gray-400 flex gap-2 items-center text-black py-2 px-8 rounded-lg hover:bg-gray-200 mt-2'
                                        >
                                            <FcGoogle className='text-lg' /> <p>LogIn with Google</p>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <button 
                                    onClick={handleLogout}
                                    className='bg-red-500 text-white py-2 px-8 rounded-lg hover:bg-red-700'
                                    >
                                        Logout
                                    </button>
                                    <p>Thank's for your visit!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Content */}
            <div className='fixed top-0 left-0 w-full h-16 bg-white shadow-lg flex justify-center items-center z-20'>
                <div className='w-[80%] flex justify-between items-center'>
                    <div className='flex items-center'>
                        <Link to='/'>
                            <img className='w-16 transition-transform duration-300 ease-in-out transform hover:scale-95 cursor-pointer' src={Logo} alt="logo" />
                        </Link>
                        <div className='flex items-center ml-4 cursor-pointer' onClick={() => dispatch(toggleSidebar())}>
                            <div className='font-bold flex items-center gap-1'>
                                <h4 className='border-b-2 border-black'>{updateMainPlace}</h4>
                                {updateSubPlace && <span style={truncatedTextStyle} className="text-sm text-gray-500"> - {updateSubPlace}</span>}
                            </div>
                            <IoIosArrowDown size={16} style={{ color: '#00B7EB' }} />
                        </div>
                    </div>

                    <div className='flex items-center gap-8'>
                        {navItems.map((item, index) => (
                            <Link to={item.path} key={index}>
                                <div className="flex items-center gap-2 cursor-pointer group relative">
                                    <div className="text-gray-500 group-hover:text-[#00B7EB] transition-colors">
                                        {item.name === "Cart" ? (
                                            <div className="relative">
                                                {item.image}
                                                {cartInfo.length > 0 && (
                                                    <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold rounded-full px-1 py-0.5">
                                                        {cartInfo.length}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            item.image
                                        )}
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
            </div>

            <div className="pt-5">
                <Outlet />
            </div>
        </div>
    );
};

export default Header;