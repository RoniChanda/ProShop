import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Message from "../components/ui/Message";
import useOrderRequests from "../hooks/useOrderRequests";
import useUserRequests from "../hooks/useUserRequests";
import { sharedActions } from "../redux/slices/sharedSlice";
import Meta from "../components/ui/Meta";

function ProfileScreen() {
  const { userInfo } = useSelector((state) => state.user);
  const { error, success, message, isLoading } = useSelector(
    (state) => state.shared
  );
  const dispatch = useDispatch();
  const { myOrders } = useSelector((state) => state.order);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { updateUserProfile } = useUserRequests();
  const { getMyOrders } = useOrderRequests();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(sharedActions.reset());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setFormData((prevFormData) => {
        return { ...prevFormData, name: userInfo.name, email: userInfo.email };
      });
      getMyOrders();
    } else {
      navigate("/login");
    }
  }, [navigate, userInfo, dispatch, getMyOrders]);

  const inputChangeHandler = (event) => {
    setFormData((prevFormData) => {
      return { ...prevFormData, [event.target.name]: event.target.value };
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch(sharedActions.getMessage("Passwords do not match"));
    } else {
      updateUserProfile({ id: userInfo._id, ...formData });
      setFormData((prevFormData) => {
        return { ...prevFormData, password: "", confirmPassword: "" };
      });
    }
  };

  return (
    <Row>
      <Meta title="User Profile | ProShop" />
      <Col md={3}>
        <h2>Update Profile</h2>
        {message && (
          <Message dismissType="m" variant="danger">
            {message}
          </Message>
        )}
        {error && <Message dismissType="e" variant="danger" error={error} />}
        {success && (
          <Message dismissType="s" variant="success">
            Profile Updated
          </Message>
        )}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Type your name"
              value={formData.name}
              onChange={inputChangeHandler}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Type your email"
              value={formData.email}
              onChange={inputChangeHandler}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Type your password"
              value={formData.password}
              onChange={inputChangeHandler}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={inputChangeHandler}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-1">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading === "idle" && myOrders.length === 0 && (
          <Message>No orders found</Message>
        )}
        {isLoading === "idle" && myOrders.length !== 0 && (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL PRICE</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myOrders &&
                myOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : order.outForDelivery ? (
                        "Out for delivery"
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light" className="btn-sm">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;
