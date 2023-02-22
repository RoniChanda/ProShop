import express from "express";

import auth, { admin } from "../middlewares/authMiddleware.js";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderOutForDelivery,
  updateOrderToDelivered,
} from "../controllers/orderControllers.js";

const router = express.Router();

// @route     GET /api/orders
// @desc      Get all orders
//# @access   Private(Admin)
router.get("/", auth, admin, getAllOrders);

// @route     POST /api/orders
// @desc      Create new order
// @access    Private
router.post("/", auth, addOrderItems);

// @route     GET /api/orders/myorders
// @desc      Get logged in users orders
// @access    Private
router.get("/myorders", auth, getMyOrders);

// @route     PUT /api/orders/:order_id/pay
// @desc      Update order to paid
// @access    Private
router.put("/:order_id/pay", auth, updateOrderToPaid);

// @route     PUT /api/orders/:order_id/outfordelivery
// @desc      Update order to delivered
//# @access   Private(Admin)
router.put("/:order_id/outfordelivery", auth, admin, updateOrderOutForDelivery);

// @route     PUT /api/orders/:order_id/delivered
// @desc      Update order to delivered
//# @access   Private(Admin)
router.put("/:order_id/delivered", auth, admin, updateOrderToDelivered);

// @route     GET /api/orders/:order_id
// @desc      Get order by Id
// @access    Private
router.get("/:order_id", auth, getOrderById);

export default router;
