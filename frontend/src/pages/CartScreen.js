import React, { useEffect } from "react";
import {
  Col,
  ListGroup,
  Row,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";

import Message from "../components/ui/Message";
import Meta from "../components/ui/Meta";
import useCartRequests from "../hooks/useCartRequests";
import { cartActions } from "../redux/slices/cartSlice";

function CartScreen() {
  const { product_id } = useParams();
  const [searchParams] = useSearchParams();
  const { addCartItem } = useCartRequests();
  const { cartItems } = useSelector((state) => state.cart);
  const { isLoading } = useSelector((state) => state.shared);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // If qty query paramter available set it or else set it to 1
  const qty = Number(searchParams.get("qty")) || 1;

  useEffect(() => {
    if (product_id) {
      addCartItem(product_id, qty);
    }
  }, [addCartItem, product_id, qty]);

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <Row>
      <Meta title="Your Cart | ProShop" />
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {isLoading === "idle" && cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go to Products</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={3}>₹{item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addCartItem(item.product, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() =>
                        dispatch(cartActions.removeCartItem(item.product))
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              ₹
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;
