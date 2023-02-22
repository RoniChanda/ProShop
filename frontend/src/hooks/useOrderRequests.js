import { useDispatch } from "react-redux";
import { useCallback } from "react";

import store from "../redux/store";
import { orderActions } from "../redux/slices/orderSlice";
import useHttp from "./useHttp";
import { sharedActions } from "../redux/slices/sharedSlice";

function useOrderRequests() {
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  //! Create order
  const createOrder = async (order) => {
    const token = store.getState().user.userInfo.token;
    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/orders`,
      "post",
      order,
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );

    dispatch(orderActions.loadOrder(data));
    return data._id;
  };

  //! Get order by Id
  const getOrderById = useCallback(
    async (order_id) => {
      const token = store.getState().user.userInfo.token;
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URI}/api/orders/${order_id}`,
        "get",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );

      dispatch(orderActions.loadOrder(data));
    },
    [dispatch, sendRequest]
  );

  //! Pay order
  const payOrder = async (order_id, paymentResult) => {
    const token = store.getState().user.userInfo.token;

    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/orders/${order_id}/pay`,
      "put",
      paymentResult,
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
  };

  //! Get logged in users orders
  const getMyOrders = useCallback(async () => {
    const token = store.getState().user.userInfo.token;

    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/orders/myorders`,
      "get",
      null,
      { Authorization: "Bearer " + token }
    );

    if (data) {
      dispatch(orderActions.loadMyOrders(data));
    }
  }, [dispatch, sendRequest]);

  //! Get all orders (Admin)
  const getAllOrders = useCallback(
    async (pageNumber = "") => {
      const token = store.getState().user.userInfo.token;

      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URI}/api/orders?pageNumber=${pageNumber}`,
        "get",
        null,
        { Authorization: "Bearer " + token }
      );

      if (data) {
        dispatch(orderActions.loadAllOrders(data.orders));
        dispatch(sharedActions.getPagesNeeded(data.pagesNeeded));
      }
    },
    [dispatch, sendRequest]
  );

  //! out for delivery order (Admin)
  const outForDeliveryOrder = async (order_id) => {
    const token = store.getState().user.userInfo.token;

    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/orders/${order_id}/outfordelivery`,
      "put",
      {},
      { Authorization: "Bearer " + token }
    );
  };

  //! Deliver order (Admin)
  const deliverOrder = async (order_id) => {
    const token = store.getState().user.userInfo.token;

    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/orders/${order_id}/delivered`,
      "put",
      {},
      { Authorization: "Bearer " + token }
    );
  };

  return {
    createOrder,
    getOrderById,
    payOrder,
    getMyOrders,
    getAllOrders,
    outForDeliveryOrder,
    deliverOrder,
  };
}

export default useOrderRequests;
