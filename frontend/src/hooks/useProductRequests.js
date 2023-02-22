import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { productActions } from "../redux/slices/productSlice";
import useHttp from "./useHttp";
import store from "../redux/store";
import { sharedActions } from "../redux/slices/sharedSlice";

function useProductRequests() {
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  //! get products
  const getProducts = useCallback(
    async (keyword = "", pageNumber = "") => {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URI}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`,
        "get"
      );

      if (data) {
        dispatch(productActions.loadAllProducts(data.products));
        dispatch(sharedActions.getPagesNeeded(data.pagesNeeded));
      }
    },
    [sendRequest, dispatch]
  );

  //! get product by product id
  const getProductById = useCallback(
    async (product_id) => {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URI}/api/products/${product_id}`,
        "get"
      );

      if (data) {
        dispatch(productActions.loadProduct(data));
      }
    },
    [dispatch, sendRequest]
  );

  //! delete product (Admin)
  const deleteProduct = async (product_id) => {
    const token = store.getState().user.userInfo.token;

    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/products/${product_id}`,
      "delete",
      null,
      { Authorization: "Bearer " + token }
    );
  };

  //! Create product (Admin)
  const createProduct = async () => {
    const token = store.getState().user.userInfo.token;

    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/products`,
      "post",
      {}, // We sending post request but not sending data. so we sending empty object
      { Authorization: "Bearer " + token }
    );

    if (data) {
      dispatch(productActions.loadProduct(data));
      return data;
    }
  };

  //! update product (Admin)
  const updateProduct = async (product_id, productData) => {
    const token = store.getState().user.userInfo.token;

    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/products/${product_id}`,
      "put",
      productData,
      { Authorization: "Bearer " + token, "Content-Type": "application/json" }
    );

    if (data) {
      dispatch(productActions.loadProduct(data));
      dispatch(sharedActions.getSuccess());
    }
  };

  //! Upload Image (Admin)
  const uploadImage = async (formData) => {
    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/upload`,
      "post",
      formData,
      { "Content-Type": "multipart/form-data" }
    );

    if (data) {
      const url = `${process.env.REACT_APP_BACKEND_URI}/${data}`;
      return url;
    }
  };

  //! Create product review
  const createProductReview = async (product_id, review) => {
    const token = store.getState().user.userInfo.token;

    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/products/${product_id}/reviews`,
      "post",
      review,
      { Authorization: "Bearer " + token, "Content-Type": "application/json" }
    );

    if (data) {
      dispatch(sharedActions.getSuccess());
      return data;
    }
  };

  //! Get top rated products
  const getTopRatedProducts = useCallback(async () => {
    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/products/top`,
      "get"
    );

    if (data) {
      dispatch(productActions.loadTopRatedProducts(data));
    }
  }, [sendRequest, dispatch]);

  return {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    uploadImage,
    createProductReview,
    getTopRatedProducts,
  };
}

export default useProductRequests;
