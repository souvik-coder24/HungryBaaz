import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Provider } from 'react-redux';
import store from './store/store';
import Header from './components/Header/Header';
import Body from './Body';
import RestroMenu from './components/RestaurentMenu/RestroMenu';
import Cart from './components/Cart/Cart';
import AddressForm from './components/Cart/AddressForm';
import Help from './components/Help&FAQ/Help';
import Offer from './components/Offer';
import Footer from './components/Footer/Footer'
import Search from './components/Search';
import Cuisine from './components/Cuisine/Cuisine';


export default function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header onLocationSelect={setLocation} />
        <Routes>
          <Route path='/' element={<Body latitude={location.latitude} longitude={location.longitude} />} />
          <Route path='/res/:id' element={<RestroMenu />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/newAddress' element={<AddressForm />} />
          <Route path='/help' element={<Help />} />
          <Route path="/cuisine/:description" element={<Cuisine />} />
          <Route path='/offers' element={<Offer />} />
          <Route path='/search' element={<Search latitude={location.latitude} longitude={location.longitude}/>} />
        </Routes>
        <div className='mt-32'>
          <Footer/>
        </div>
      </BrowserRouter>
    </Provider>
  );
}