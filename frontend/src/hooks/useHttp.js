import axios from "axios";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { sharedActions } from "../redux/slices/sharedSlice";

function useHttp() {
  const dispatch = useDispatch();

  const sendRequest = useCallback(
    async (url, method, body = null, headers = {}) => {
      try {
        dispatch(sharedActions.load());
        const { data } = await axios({ method, url, data: body, headers });
        dispatch(sharedActions.unload());
        return data;
      } catch (error) {
        const payload = {
          msg: error.response.data.message,
          status: error.response.status,
        };
        dispatch(sharedActions.getError(payload));
      }
    },
    [dispatch]
  );

  return { sendRequest };
}

export default useHttp;
