import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  myOrders: [],
  allOrders: [],
};

const orderSlice = createSlice({
  name: "Order",
  initialState,
  reducers: {
    loadOrder: (state, { payload }) => {
      state.order = payload;
    },
    loadMyOrders: (state, { payload }) => {
      state.myOrders = payload;
    },
    loadAllOrders: (state, { payload }) => {
      state.allOrders = payload;
    },
    reset: (state) => {
      state.order = null;
      state.myOrders = [];
      state.allOrders = [];
    },
  },
});

export const orderActions = orderSlice.actions;
export default orderSlice.reducer;
