import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CheckoutSteps from "../components/ui/CheckoutSteps";
import FormContainer from "../components/ui/FormContainer";
import Meta from "../components/ui/Meta";
import { cartActions } from "../redux/slices/cartSlice";

function ShippingScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    postalCode: shippingAddress.postalCode || "",
    country: shippingAddress.country || "",
  });

  const inputChangeHandler = (event) => {
    setFormData((prevFormData) => {
      return { ...prevFormData, [event.target.name]: event.target.value };
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(cartActions.saveShippingAddress(formData));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <Meta title="Save Address | ProShop" />
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            placeholder="Type your address"
            value={formData.address}
            onChange={inputChangeHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city" className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            placeholder="Type your city"
            value={formData.city}
            onChange={inputChangeHandler}
          ></Form.Control>
          <Form.Group controlId="postalCode" className="my-3">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              placeholder="Type your postal code"
              value={formData.postalCode}
              onChange={inputChangeHandler}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="country" className="my-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              placeholder="Type your country"
              value={formData.country}
              onChange={inputChangeHandler}
            ></Form.Control>
          </Form.Group>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-1">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
