import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authSlice from './authSlice';
import addressReducer from './addressSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    authSlice,
    addresses: addressReducer,
  },
});

export default store;