import React, { Fragment, useEffect } from "react";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Spinner,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  destroySDKScript,
  getScriptID,
} from "@paypal/react-paypal-js";

import Message from "../components/ui/Message";
import useOrderRequests from "../hooks/useOrderRequests";
import Loader from "../components/ui/Loader";
import Meta from "../components/ui/Meta";

function OrderScreen() {
  const [{ isInitial, isPending, isResolved }, dispatch] =
    usePayPalScriptReducer();
  const { order_id } = useParams();
  const { getOrderById, payOrder, deliverOrder, outForDeliveryOrder } =
    useOrderRequests();
  const { order } = useSelector((state) => state.order);
  const { isLoading, error } = useSelector((state) => state.shared);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    getOrderById(order_id);
  }, [getOrderById, order_id]);

  //# paypal script render and remove
  useEffect(() => {
    if (order && userInfo._id === order.user._id) {
      if (!order.isPaid && isInitial) {
        dispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      }
      if (order.isPaid && isResolved) {
        destroySDKScript(
          getScriptID({ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID })
        );
        dispatch({
          type: "setLoadingStatus",
          value: "initial",
        });
      }
    }
  }, [order, isInitial, dispatch, isResolved, userInfo]);

  const createOrderHandler = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    });
  };

  const successPaymentHandler = (data, actions) => {
    return actions.order.capture().then((paymentResult) => {
      payOrder(order_id, paymentResult).then(() => getOrderById(order_id));
    });
  };

  const outForDeliveryHandler = () => {
    outForDeliveryOrder(order_id).then(() => getOrderById(order_id));
  };

  const deliverHandler = () => {
    deliverOrder(order_id).then(() => getOrderById(order_id));
  };

  return (
    <Fragment>
      <Meta title={`Order ${order_id}`} />
      <h1>Order {order_id}</h1>
      {error && <Message dismissType="e" variant="danger" error={error} />}
      {isLoading === "idle" && order && (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong>
                  {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : order.outForDelivery ? (
                  <Loader loadMessage="Out for delivery" />
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant="success">Paid on {order.paidAt}</Message>
                ) : (
                  <Message variant="danger">Not paid</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item) => (
                      <ListGroup.Item key={item.product}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ₹{item.price} = ₹
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>₹{order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>₹{order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>₹{order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>₹{order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {userInfo._id === order.user._id && !order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <Spinner />
                    ) : (
                      <PayPalButtons
                        createOrder={createOrderHandler}
                        onApprove={successPaymentHandler}
                      />
                    )}
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin &&
                  order.isPaid &&
                  !order.outForDelivery &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        type="button"
                        className="btn btn-block"
                        onClick={outForDeliveryHandler}
                      >
                        Dispatch Order
                      </Button>
                    </ListGroup.Item>
                  )}
                {userInfo.isAdmin &&
                  order.isPaid &&
                  order.outForDelivery &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        type="button"
                        className="btn btn-block"
                        onClick={deliverHandler}
                      >
                        Mark As Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </Fragment>
  );
}

export default OrderScreen;
