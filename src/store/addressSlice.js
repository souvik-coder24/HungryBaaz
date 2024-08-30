import { createSlice } from '@reduxjs/toolkit';

const loadAddressesFromLocalStorage = () => {
  const savedAddresses = localStorage.getItem('addresses');
  return savedAddresses ? JSON.parse(savedAddresses) : [];
};

const setLocalStorage = (addresses) => {
  localStorage.setItem('addresses', JSON.stringify(addresses));
};

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    addresses: loadAddressesFromLocalStorage(),
  },
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
      setLocalStorage(state.addresses);
    },

    addAddress: (state, action) => {
      if (state.addresses.length >= 2) {
        return;
      }
      state.addresses.push(action.payload);
      setLocalStorage(state.addresses);
    },
    
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter((_, index) => index !== action.payload);
      setLocalStorage(state.addresses);
    },
    
    updateAddress: (state, action) => {
      const { index, updatedAddress } = action.payload;
      if (state.addresses[index]) {
        state.addresses[index] = { ...state.addresses[index], ...updatedAddress };
        setLocalStorage(state.addresses);
      }
    },
  },
});

export const { setAddresses, addAddress, removeAddress, updateAddress } = addressSlice.actions;

export default addressSlice.reducer;
