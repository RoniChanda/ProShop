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

function LoginScreen() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [searchParams] = useSearchParams();
  const { loginUser } = useUserRequests();
  const { userInfo } = useSelector((state) => state.user);
  const { error, isLoading } = useSelector((state) => state.shared);
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
    loginUser(formData);
  };

  return (
    <FormContainer>
      <Meta title="Login | ProShop" />
      <h1>Sign In</h1>
      {error && <Message dismissType="e" variant="danger" error={error} />}
      {isLoading === "pending" && <Loader loadMessage="Please wait" />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
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
          <Form.Label>Enter Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Type your password"
            value={formData.password}
            onChange={inputChangeHandler}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-1">
          Sign In
        </Button>
      </Form>

      <Row className="my-1">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;
