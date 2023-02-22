import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  user: {},
  users: [],
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    getUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.user = {};
    },
    loadUsers: (state, { payload }) => {
      state.users = payload;
    },
    loadUser: (state, { payload }) => {
      state.user = payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
