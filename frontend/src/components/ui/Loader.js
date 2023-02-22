import React from "react";

import loader from "../../assets/loader.gif";

function Loader({ loadMessage }) {
  return (
    <div className="loader">
      {loadMessage || "Loading"} <img src={loader} alt="..." />
    </div>
  );
}

export default Loader;
