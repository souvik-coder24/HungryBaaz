
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartInfo: [],
    isSidebarVisible: false,
    isSignInSidebarVisible:false,
    filterVal: null
  },
  reducers: {
    setCartInfo: (state, action) => {
      state.cartInfo = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible;
    },
    toggleSignInSidebar: (state) => {
      state.isSignInSidebarVisible = !state.isSignInSidebarVisible;
    },
    addToCart: (state, action) => {
      state.cartInfo.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cartInfo = state.cartInfo.filter((_, index) => index !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { index, amount } = action.payload;
      const item = state.cartInfo[index];
      if (item) {
        item.quantity = Math.max(1, (item.quantity || 1) + amount);
      }
    },
    setFilterValue: (state,action) => {
      state.filterVal = action.payload
    }
  },
});

export const { setCartInfo, toggleSidebar, toggleSignInSidebar, addToCart, removeFromCart, updateQuantity, setFilterValue } = cartSlice.actions;

export default cartSlice.reducer;