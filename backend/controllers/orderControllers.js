import HttpError from "../models/httpError.js";
import Order from "../models/orderModel.js";

//! Add order items
const addOrderItems = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return next(new HttpError("No order items found", 400));
    }

    const order = new Order({
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get Order by Id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.order_id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return next(new HttpError("Order not found", 404));
    }

    res.json(order);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! update order payment to paid
const updateOrderToPaid = async (req, res, next) => {
  try {
    const { id, status, update_time, payer } = req.body;

    const order = await Order.findById(req.params.order_id);
    if (!order) {
      return next(new HttpError("Order not found", 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id,
      status,
      update_time,
      email_address: payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get logged in user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    //# Pagination
    const ordersPerPage = process.env.ITEMS_PER_PAGE;
    const pageNumber = Number(req.query.pageNumber) || 1;

    const count = await Order.countDocuments({}); // Number of orders stored in database
    const pagesNeeded = Math.ceil(count / ordersPerPage); // Total pages needed

    const orders = await Order.find({})
      .populate("user", "id name")
      .limit(ordersPerPage)
      .skip(ordersPerPage * (pageNumber - 1));
    res.json({ orders, pagesNeeded });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! update order to out for delivery
const updateOrderOutForDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) {
      return next(new HttpError("Order not found", 404));
    }

    order.outForDelivery = true;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! update order to delivered
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) {
      return next(new HttpError("Order not found", 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
  updateOrderOutForDelivery,
};
