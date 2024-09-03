import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/cartSlice';
import lost from '../../assets/Logo/lost.gif';

const SearchSidebar = ({ isSidebarVisible, onLocationSelect, onHeaderUpdate, onClose }) => {
    const dispatch = useDispatch();
    const [searchResult, setSearchResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

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
            console.log('API response:', result);

            const place = result?.data?.[0];
            console.log('Extracted place:', place);

            const latitude = place?.geometry?.location?.lat;
            const longitude = place?.geometry?.location?.lng;
            const formattedAddress = place?.formatted_address;

            console.log('Place data:', { latitude, longitude, formattedAddress });

            if (latitude && longitude) {
                onLocationSelect({ latitude, longitude, formattedAddress });
                if (formattedAddress) {
                    onHeaderUpdate(formattedAddress);
                } else {
                    console.error('Formatted address is undefined');
                    onHeaderUpdate(''); 
                }
                onClose();
                dispatch(toggleSidebar());
            }
        } catch (error) {
            console.error('Error fetching place data:', error);
        }
    };

    const handleItemClick = (placeId) => {
        getPlaceData(placeId);
        setSearchQuery('');
    };

    const handleRecentSearchClick = (place) => {
        getPlaceData(place.place_id);
        setSearchQuery('');
    };

    useEffect(() => {
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        } else {
            setSearchResult([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(savedSearches);
    }, []);

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    return (
        <>
            <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isSidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
            <div className={`fixed top-0 left-0 h-full bg-white z-40 transition-transform duration-300 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
                w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4`}
            >
                <IoClose className='text-2xl absolute top-4 right-4 cursor-pointer' onClick={onClose} />
                <div className='p-4 mt-16'>
                    <input 
                        type="text" 
                        className='border rounded-lg p-2 w-full focus:outline-none hover:shadow-lg' 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className='mt-2'>
                        {recentSearches.length > 0 && (
                            <div>
                                <h4 className='font-bold mb-2'>Recent Searches</h4>
                                <ul className='border border-gray-400 rounded-lg'>
                                    {recentSearches.map((search, index) => (
                                        <li 
                                            key={index} 
                                            className='py-2 px-4 cursor-pointer border-b border-gray-300 hover:bg-gray-100' 
                                            onClick={() => handleRecentSearchClick(search)}
                                        >
                                            <div className='flex justify-between items-center'>
                                                <div>
                                                    <h4 className='font-semibold hover:text-blue-600'>{search.structured_formatting?.main_text}</h4> 
                                                    <p className="text-sm opacity-65">{search.structured_formatting?.secondary_text}</p>
                                                </div>
                                                <FaSearch className='text-lg text-blue-600 font-bold'/>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {searchResult.length > 0 ? (
                            <ul className='border border-gray-400 rounded-lg mt-4'>
                                {searchResult.map((data, index) => (
                                    <li 
                                        key={index} 
                                        className='py-2 px-4 cursor-pointer border-b border-gray-300 hover:bg-gray-100' 
                                        onClick={() => {
                                            handleItemClick(data.place_id);

                                            setRecentSearches((prevSearches) => {
                                                const newSearch = data;
                                                const updatedSearches = [newSearch, ...prevSearches];
                                                if (updatedSearches.length > 3) {
                                                    updatedSearches.pop();
                                                }
                                                return updatedSearches;
                                            });
                                        }}
                                    >
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <h4 className='font-semibold hover:text-blue-600'>{data.structured_formatting?.main_text}</h4> 
                                                <p className="text-sm opacity-65">{data.structured_formatting?.secondary_text}</p>
                                            </div>
                                            <FaSearch className='text-lg text-blue-600 font-bold'/>
                                        </div>
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
        </>
    );
};

export default SearchSidebar;