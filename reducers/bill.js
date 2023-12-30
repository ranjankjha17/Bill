import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


const initialState = {
  bill: [],  
};

const studentSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    addBill: (state, action) => {  
      state.bill.push(action.payload);
      AsyncStorage.setItem('bill', JSON.stringify(state.bill));
    },
    // deleteStudent: (state, action) => {     
    //   state.students = state.students.filter(student => student.rowid !== action.payload);
    //   AsyncStorage.setItem('students', JSON.stringify(state.students));
    // },
    loadBill: (state, action) => {
      state.bill = action.payload;
    },
    resetBill: state => {
      state.bill = [];
    },
  
  },
});

export const { addBill,  loadBill,resetBill } = studentSlice.actions;

export default studentSlice.reducer;