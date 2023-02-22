import React, { useEffect, useState } from "react";
import { Button, Form, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CheckoutSteps from "../components/ui/CheckoutSteps";
import FormContainer from "../components/ui/FormContainer";
import Meta from "../components/ui/Meta";
import { cartActions } from "../redux/slices/cartSlice";

function PaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(cartActions.savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <Meta title="Save payment method | ProShop" />
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
        </Form.Group>
        <Col>
          <Form.Check
            type="radio"
            label="PayPal or Credit card"
            id="PayPal"
            name="paymentMethod"
            value="PayPal"
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
        </Col>
        <Button type="submit" variant="primary" className="my-1">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
