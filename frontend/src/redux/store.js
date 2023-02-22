import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import sharedReducer from "./slices/sharedSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    shared: sharedReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

//# Save cartItems, userInfo in localStorage on store refresh
store.subscribe(() => {
  localStorage.setItem(
    "cartItems",
    JSON.stringify(store.getState().cart.cartItems)
  );
  localStorage.setItem(
    "userInfo",
    JSON.stringify(store.getState().user.userInfo)
  );
  localStorage.setItem(
    "shippingAddress",
    JSON.stringify(store.getState().cart.shippingAddress)
  );
  localStorage.setItem(
    "paymentMethod",
    JSON.stringify(store.getState().cart.paymentMethod)
  );
});

export default store;
