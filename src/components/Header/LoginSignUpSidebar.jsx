import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { toggleSignInSidebar } from '../../store/cartSlice';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../Firebase/auth';
import { addUserData, removeuserData } from '../../store/authSlice';
import { FcGoogle } from "react-icons/fc";

const LoginSignUpSidebar = () => {
    const dispatch = useDispatch();
    const isSignInSidebarVisible = useSelector((state) => state.cart.isSignInSidebarVisible);
    const userData = useSelector((state) => state.authSlice.userData);

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

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

    const handleToggleSignUp = () => setIsSignUp(!isSignUp);

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
            if (user) {
                const userData = {
                    name: user.displayName || 'Guest',
                    photo: user.photoURL || ''
                };
                dispatch(addUserData(userData));
            }
            dispatch(toggleSignInSidebar());
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isSignInSidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
            <div className={`fixed top-0 right-0 h-full bg-white z-50 transition-transform duration-300 ${isSignInSidebarVisible ? 'translate-x-0' : 'translate-x-full'} 
                w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4`}
            >
                <IoClose className='text-2xl absolute top-4 right-4 cursor-pointer' onClick={() => dispatch(toggleSignInSidebar())} />
                <div className='p-4 mt-16'>
                    <h2 className='text-2xl font-bold mb-4'>{isSignUp ? 'Register' : 'Log-In'}</h2>
                    <div className='flex flex-col items-center gap-4 mb-6'>
                        {userData && userData.photo ? (
                            <img src={userData.photo} alt={userData.name} className="w-16 h-16 rounded-full" />
                        ) : (
                            <div className="text-gray-500 text-6xl">
                                <CiUser/>
                            </div>
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
                                                Log In
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
                                                    Log In
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                Don't have an account? 
                                                <button 
                                                    onClick={handleToggleSignUp}
                                                    className='text-blue-400 hover:underline'
                                                >
                                                    Register
                                                </button>
                                            </>
                                        )}
                                    </p>
                                    <div className="text-center flex flex-col mt-1 justify-center items-center">
                                        <p className='text-sm text-gray-500'>or</p>
                                        <button 
                                            onClick={handleGoogleSignIn}
                                            className='bg-white border border-gray-400 flex gap-2 items-center text-black py-2 px-8 rounded-lg hover:bg-gray-200 mt-2'
                                        >
                                            <FcGoogle className='text-lg' /> <p>Log In with Google</p>
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
                                    <p>Thank you for your visit!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginSignUpSidebar;
