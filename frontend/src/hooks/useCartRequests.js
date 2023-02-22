import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useHttp from "./useHttp";
import { cartActions } from "../redux/slices/cartSlice";

function useCartRequests() {
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  //! Add Item to cart
  const addCartItem = useCallback(
    async (product_id, qty) => {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URI}/api/products/${product_id}`,
        "get"
      );

      if (data) {
        const payload = {
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty,
        };

        dispatch(cartActions.addCartItem(payload));
      }
    },
    [dispatch, sendRequest]
  );

  return { addCartItem };
}

export default useCartRequests;
