import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { sharedActions } from "../../redux/slices/sharedSlice";

function Message({ variant = "info", dismissType, error, children }) {
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();

  const closeHandler = () => {
    setShow(false);
    dispatch(sharedActions.clearType(dismissType));
  };

  if (show) {
    return (
      <Alert
        variant={variant}
        onClose={closeHandler}
        dismissible={!!dismissType}
      >
        {error && error.msg}
        {children}
      </Alert>
    );
  }
}

export default Message;
