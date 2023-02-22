import React, { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import FormContainer from "../components/ui/FormContainer";
import Message from "../components/ui/Message";
import Meta from "../components/ui/Meta";
import useProductRequests from "../hooks/useProductRequests";

function ProductEditScreen() {
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  });
  const { product_id: productId } = useParams();
  const { getProductById, updateProduct, uploadImage } = useProductRequests();
  const { product } = useSelector((state) => state.product);
  const { error, isLoading, success } = useSelector((state) => state.shared);

  useEffect(() => {
    if (!product.name || productId !== product._id) {
      getProductById(productId);
    } else {
      setProductData((prevData) => {
        return {
          ...prevData,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          category: product.category,
          countInStock: product.countInStock,
          description: product.description,
        };
      });
    }
  }, [getProductById, product, productId]);

  const inputHandler = (event) => {
    setProductData((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };

  const uploadFileHandler = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    uploadImage(formData).then((url) => {
      setProductData((prevData) => {
        return { ...prevData, image: url };
      });
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    updateProduct(productId, productData);
  };

  return (
    <Fragment>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {success && (
          <Message dismissType="s" variant="success">
            Product Updated
          </Message>
        )}
        {error && <Message dismissType="e" variant="danger" error={error} />}
        {isLoading === "idle" && product.name && (
          <Form onSubmit={submitHandler}>
            <Meta title={`Admin | Edit ${product.name} | ProShop`} />
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={productData.name}
                onChange={inputHandler}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price" className="my-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter price (in INR)"
                value={productData.price}
                onChange={inputHandler}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image" className="my-3">
              <Form.Label>Image (640x510px)</Form.Label>
              <Form.Control
                type="text"
                name="image"
                placeholder="Enter image URL"
                value={productData.image}
                onChange={inputHandler}
              ></Form.Control>
              <Form.Control
                id="image-file"
                type="file"
                onChange={uploadFileHandler}
              />
            </Form.Group>
            <Form.Group controlId="brand" className="my-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                placeholder="Enter brand"
                value={productData.brand}
                onChange={inputHandler}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category" className="my-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Enter category"
                value={productData.category}
                onChange={inputHandler}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock" className="my-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                name="countInStock"
                placeholder="Enter count in stock"
                value={productData.countInStock}
                onChange={inputHandler}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description" className="my-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Enter description"
                value={productData.description}
                onChange={inputHandler}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-1">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Fragment>
  );
}

export default ProductEditScreen;
