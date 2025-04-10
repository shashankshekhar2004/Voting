
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  token: null,
  id: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.id = null;
    },
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;
