import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  shippingAddress: JSON.parse(localStorage.getItem("shippingAddress")) || {},
  paymentMethod: JSON.parse(localStorage.getItem("paymentMethod")) || null,
  itemsPrice: null,
  shippingPrice: null,
  taxPrice: null,
  totalPrice: null,
};

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    addCartItem: (state, { payload }) => {
      const existItemIndex = state.cartItems.findIndex(
        (x) => x.product === payload.product
      );

      if (existItemIndex >= 0) {
        state.cartItems[existItemIndex] = payload;
      } else {
        state.cartItems.push(payload);
      }
    },
    removeCartItem: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== payload);
    },
    saveShippingAddress: (state, { payload }) => {
      state.shippingAddress = payload;
    },
    savePaymentMethod: (state, { payload }) => {
      state.paymentMethod = payload;
    },
    calculateTotalPrice: (state) => {
      const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
      };

      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
      );
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100);
      state.taxPrice = addDecimals(
        Number((0.15 * state.itemsPrice).toFixed(2))
      );
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
