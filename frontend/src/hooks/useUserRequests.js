import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useHttp from "./useHttp";
import { userActions } from "../redux/slices/userSlice";
import store from "../redux/store";
import { sharedActions } from "../redux/slices/sharedSlice";

function useUserRequests() {
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  //! Login User
  const loginUser = async (formData) => {
    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/users/login`,
      "post",
      formData,
      { "Content-Type": "application/json" }
    );

    if (data) {
      dispatch(userActions.getUserInfo(data));
    }
  };

  //! Register User
  const registerUser = async (formData) => {
    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/users`,
      "post",
      formData,
      { "Content-Type": "application/json" }
    );

    if (data) {
      dispatch(userActions.getUserInfo(data));
    }
  };

  //! Update user profile
  const updateUserProfile = async (userProfile) => {
    const token = store.getState().user.userInfo.token;
    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/users/profile`,
      "put",
      userProfile,
      { "Content-Type": "application/json", Authorization: "Bearer " + token }
    );

    if (data) {
      dispatch(userActions.getUserInfo(data));
      dispatch(sharedActions.getSuccess());
    }
  };

  //! Get user by Id (Admin)
  const getUserById = useCallback(
    async (user_id) => {
      const token = store.getState().user.userInfo.token;
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URI}/api/users/${user_id}`,
        "get",
        null,
        { Authorization: "Bearer " + token }
      );

      if (data) {
        dispatch(userActions.loadUser(data));
      }
    },
    [dispatch, sendRequest]
  );

  //! Get all users (Admin)
  const getUsers = useCallback(
    async (pageNumber = "") => {
      const token = store.getState().user.userInfo.token;

      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URI}/api/users?pageNumber=${pageNumber}`,
        "get",
        null,
        { Authorization: "Bearer " + token }
      );

      if (data) {
        dispatch(userActions.loadUsers(data.users));
        dispatch(sharedActions.getPagesNeeded(data.pagesNeeded));
      }
    },
    [dispatch, sendRequest]
  );

  //! Delete an user (Admin)
  const deleteUser = async (user_id) => {
    const token = store.getState().user.userInfo.token;

    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/users/${user_id}`,
      "delete",
      null,
      { Authorization: "Bearer " + token }
    );
  };

  //! Update user by Id
  const updateUserById = async (user_id, formData) => {
    const token = store.getState().user.userInfo.token;

    const data = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URI}/api/users/${user_id}`,
      "put",
      formData,
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );

    if (data) {
      dispatch(userActions.loadUser(data));
      dispatch(sharedActions.getSuccess());
    }
  };

  return {
    loginUser,
    registerUser,
    updateUserProfile,
    getUserById,
    getUsers,
    deleteUser,
    updateUserById,
  };
}

export default useUserRequests;
