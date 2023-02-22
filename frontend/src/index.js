import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import App from "./App";
import store from "./redux/store";

import "./bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PayPalScriptProvider
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
      }}
      deferLoading={true}
    >
      <App />
    </PayPalScriptProvider>
  </Provider>
);
