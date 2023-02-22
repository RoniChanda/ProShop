import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken.js";
import HttpError from "../models/httpError.js";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";

//! Login User
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array().map((e) => e.msg);
      return next(new HttpError(err, 400));
    }

    const { email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (!existUser) {
      return next(new HttpError("Invalid Credentials", 401));
    }

    const passwordMatch = await bcrypt.compare(password, existUser.password);
    if (!passwordMatch) {
      return next(new HttpError("Invalid Credentials", 401));
    }

    res.json({
      _id: existUser._id,
      name: existUser.name,
      email: existUser.email,
      isAdmin: existUser.isAdmin,
      token: generateToken(existUser._id),
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Register new User
const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array().map((e) => e.msg);
      return next(new HttpError(err, 400));
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new HttpError("User already exists, login instead", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array().map((e) => e.msg);
      return next(new HttpError(err, 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (user.email !== req.body.email) {
      const foundEmail = await User.findOne({ email: req.body.email });
      if (foundEmail) {
        return next(
          new HttpError("Email already exists. Please use different email", 400)
        );
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password && req.body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get users (Admin Only)
const getUsers = async (req, res, next) => {
  try {
    //# Pagination
    const usersPerPage = process.env.ITEMS_PER_PAGE;
    const pageNumber = Number(req.query.pageNumber) || 1;

    const count = await User.countDocuments({}); // Number of users stored in database
    const pagesNeeded = Math.ceil(count / usersPerPage); // Total pages needed

    const users = await User.find({})
      .select("-password")
      .limit(usersPerPage)
      .skip(usersPerPage * (pageNumber - 1));
    if (!users) {
      return next(new HttpError("No Users yet", 404));
    }
    res.json({ users, pagesNeeded });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Delete an user (Admin Only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    await user.remove();
    res.json({ message: "User removed" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get user by Id (Admin Only)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    res.json(user);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Update user by Id (Admin Only)
const updateUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array().map((e) => e.msg);
      return next(new HttpError(err, 400));
    }

    const user = await User.findById(req.params.user_id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (user.email !== req.body.email) {
      const foundEmail = await User.findOne({ email: req.body.email });
      if (foundEmail) {
        return next(
          new HttpError("Email already exists. Please use different email", 400)
        );
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export {
  loginUser,
  getUserProfile,
  registerUser,
  updateProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
};
