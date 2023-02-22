import React, { Fragment, useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Message from "../components/ui/Message";
import Meta from "../components/ui/Meta";
import Paginate from "../components/ui/Paginate";
import useProductRequests from "../hooks/useProductRequests";

function ProductListScreen() {
  const { getProducts, deleteProduct, createProduct } = useProductRequests();
  const { products } = useSelector((state) => state.product);
  const { isLoading, error } = useSelector((state) => state.shared);
  const navigate = useNavigate();

  const pageNumber = useParams().pageNumber || 1;

  useEffect(() => {
    getProducts("", pageNumber);
  }, [getProducts, pageNumber]);

  const createProductHandler = () => {
    createProduct().then((data) => navigate(`/admin/product/${data._id}/edit`));
  };

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteProduct(id).then(() => getProducts("", pageNumber));
    }
  };

  return (
    <Fragment>
      <Meta title="Admin | Products | ProShop" />
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {error && <Message variant="danger" error={error} />}
      {isLoading === "idle" && products.length !== 0 && (
        <Fragment>
          <Table striped bordered responsive hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pageNumber={pageNumber} isAdmin={true} type="productlist" />
        </Fragment>
      )}
    </Fragment>
  );
}

export default ProductListScreen;
