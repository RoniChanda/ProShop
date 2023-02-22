import jwt from "jsonwebtoken";

import HttpError from "../models/httpError.js";
import User from "../models/userModel.js";

const auth = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new HttpError("Not authorized, no token found", 401));
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    //# Assinging user data to the request header as req.user
    req.user = await User.findById(decodedPayload.id).select("-password");

    next();
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new HttpError("Not authorized as an admin", 401));
  }
};

export default auth;
export { admin };
