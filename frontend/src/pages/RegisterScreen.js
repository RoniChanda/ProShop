import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import FormContainer from "../components/ui/FormContainer";
import Loader from "../components/ui/Loader";
import Message from "../components/ui/Message";
import Meta from "../components/ui/Meta";
import useUserRequests from "../hooks/useUserRequests";
import { sharedActions } from "../redux/slices/sharedSlice";

function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [searchParams] = useSearchParams();
  const { registerUser } = useUserRequests();
  const { userInfo } = useSelector((state) => state.user);
  const { error, isLoading, message } = useSelector((state) => state.shared);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //# Get redirect query parameter
  const redirect = searchParams.get("redirect") || "";

  useEffect(() => {
    dispatch(sharedActions.reset());

    if (userInfo) {
      navigate(`/${redirect}`);
    }
  }, [navigate, userInfo, redirect, dispatch]);

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
      registerUser(formData);
    }
  };

  return (
    <FormContainer>
      <Meta title="Register | ProShop" />
      <h1>Sign Up</h1>
      {message && (
        <Message dismissType="m" variant="danger">
          {message}
        </Message>
      )}
      {error && <Message dismissType="e" variant="danger" error={error} />}
      {isLoading === "pending" && <Loader loadMessage="Please wait" />}
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
          Register
        </Button>
      </Form>

      <Row className="my-1">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;
