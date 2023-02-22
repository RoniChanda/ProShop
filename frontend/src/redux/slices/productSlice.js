import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: { reviews: [] },
  topRatedProducts: [],
};

const productSlice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    loadAllProducts: (state, { payload }) => {
      state.products = payload;
    },
    loadProduct: (state, { payload }) => {
      state.product = payload;
    },
    loadTopRatedProducts: (state, { payload }) => {
      state.topRatedProducts = payload;
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
