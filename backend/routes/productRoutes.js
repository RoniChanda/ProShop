import express from "express";

import {
  getAllProducts,
  getTopRatedProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
} from "../controllers/productControllers.js";
import auth, { admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// @route     GET /api/products
// @desc      Get all products
// @access    Public
router.get("/", getAllProducts);

// @route     GET /api/products/top
// @desc      Get top rated products
// @access    Public
router.get("/top", getTopRatedProducts);

// @route     POST /api/products
// @desc      Create product
//# @access   Private(Admin)
router.post("/", auth, admin, createProduct);

// @route     POST /api/products/:product_id/reviews
// @desc      Create new review
// @access    Private
router.post("/:product_id/reviews", auth, createProductReview);

// @route     GET /api/products/:product_id
// @desc      Get single product by Id
// @access    Public
router.get("/:product_id", getProductById);

// @route     DELETE /api/products/:product_id
// @desc      Delete single product by Id
//# @access   Private (Admin)
router.delete("/:product_id", auth, admin, deleteProductById);

// @route     PUT /api/products/:product_id
// @desc      Update product
//# @access   Private(Admin)
router.put("/:product_id", auth, admin, updateProduct);

export default router;
