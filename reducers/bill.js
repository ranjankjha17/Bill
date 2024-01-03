import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


const initialState = {
  bill: [],  
  bags: 0,
};

const studentSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    addBill: (state, action) => {  
      state.bill.push(action.payload);
      AsyncStorage.setItem('bill', JSON.stringify(state.bill));
    },
    loadBill: (state, action) => {
      state.bill = action.payload;
    },
    resetBill: state => {
      state.bill = [];
    },
    initializeBags: (state, action) => {
      state.bags = action.payload;
    },
    increaseBag: (state) => {
      state.bags += 1;
    },
    decreaseBag: (state) => {
      state.bags -= 1;
    },  
  },
});

export const { addBill,  loadBill,resetBill,increaseBag,decreaseBag } = studentSlice.actions;

export default studentSlice.reducer;