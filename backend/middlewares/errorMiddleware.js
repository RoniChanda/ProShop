import HttpError from "../models/httpError.js";

//! Page not found error
const notFound = (req, res, next) => {
  next(new HttpError(`Page not found - ${req.originalUrl}`, 404));
};

//! Express error handler
const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    next(error);
  }

  const statusCode = error.code === 200 ? 500 : error.code;
  res.status(statusCode);
  res.json({
    message: error.message || "An unknown error has occured!",
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

export { notFound, errorHandler };
