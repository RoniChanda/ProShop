import express from "express";
import { check } from "express-validator";

import {
  loginUser,
  getUserProfile,
  registerUser,
  updateProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
} from "../controllers/userControllers.js";
import auth, { admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// @route     POST /api/users/login
// @desc      Login user and get token
// @access    Public
router.post(
  "/login",
  [
    check("email", " Email required").trim().isEmail(),
    check("password", " Password required").trim().notEmpty(),
  ],
  loginUser
);

// @route     GET /api/users/profile
// @desc      Get user profile
// @access    Private
router.get("/profile", auth, getUserProfile);

// @route     PUT /api/users/profile
// @desc      Update User profile
// @access    Private
router.put(
  "/profile",
  [
    auth,
    [
      check("name", " Name required").trim().notEmpty(),
      check("email", " Email required").trim().isEmail(),
    ],
  ],
  updateProfile
);

// @route     POST /api/users
// @desc      Register new User
// @access    Public
router.post(
  "/",
  [
    check("name", " Name required").trim().notEmpty(),
    check("email", " Email required").trim().isEmail(),
    check("password", " Password required").trim().notEmpty(),
  ],
  registerUser
);

// @route     GET /api/users
// @desc      Get all users
//# @access    Private( Admin Only)
router.get("/", auth, admin, getUsers);

// @route     DELETE /api/users/:user_id
// @desc      Delete an user
//# @access    Private( Admin Only)
router.delete("/:user_id", auth, admin, deleteUser);

// @route     GET /api/users/:user_id
// @desc      Get user by Id
//# @access    Private( Admin Only)
router.get("/:user_id", auth, admin, getUserById);

// @route     PUT /api/users/:user_id
// @desc      Update an user
//# @access    Private( Admin Only)
router.put(
  "/:user_id",
  [
    auth,
    admin,
    [
      check("name", " Name required").trim().notEmpty(),
      check("email", " Email required").trim().isEmail(),
    ],
  ],
  updateUserById
);

export default router;
