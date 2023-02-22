import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: "idle",
  error: null,
  message: null,
  success: false,
  pagesNeeded: null,
};

const sharedSlice = createSlice({
  name: "Shared",
  initialState,
  reducers: {
    load: (state) => {
      state.isLoading = "pending";
      // state.error = null;
    },
    unload: (state) => {
      state.isLoading = "idle";
    },
    getError: (state, { payload }) => {
      state.error = payload;
      state.isLoading = "idle";
    },
    getMessage: (state, { payload }) => {
      state.message = payload;
    },
    getSuccess: (state) => {
      state.success = true;
    },
    getPagesNeeded: (state, { payload }) => {
      state.pagesNeeded = payload;
    },
    reset: (state) => {
      state.error = null;
      state.success = false;
      state.message = null;
      state.pagesNeeded = null;
      state.pageNumber = null;
    },
    clearType: (state, { payload }) => {
      if (payload === "e") state.error = null;
      if (payload === "m") state.message = null;
      if (payload === "s") state.success = false;
    },
  },
});

export const sharedActions = sharedSlice.actions;
export default sharedSlice.reducer;
