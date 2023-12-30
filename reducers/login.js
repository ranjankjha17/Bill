import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    username: null,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload;
      state.error = null;
      AsyncStorage.setItem('auth', JSON.stringify(state.username));

    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = null;
      state.error = null;
    },
    loginFailure: (state, action) => {   
      state.error = action.payload;
    },
  },
});

export const { login, logout,loginFailure } = authSlice.actions;
export default authSlice.reducer;