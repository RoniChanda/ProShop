import React, { Fragment, useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import Product from "../components/ui/Product";
import useProductRequests from "../hooks/useProductRequests";
import { useSelector } from "react-redux";
import Message from "../components/ui/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/ui/Paginate";
import ProductCarousel from "../components/ui/ProductCarousel";
import Meta from "../components/ui/Meta";

function HomeScreen() {
  const { products } = useSelector((state) => state.product);
  const { isLoading, error } = useSelector((state) => state.shared);
  const { getProducts } = useProductRequests();
  const keyword = useParams().keyword;
  const pageNumber = useParams().pageNumber || 1;

  useEffect(() => {
    getProducts(keyword, pageNumber);
  }, [getProducts, keyword, pageNumber]);

  return (
    <Fragment>
      <Meta />
      {error && <Message dismissType="e" variant="danger" error={error} />}
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {isLoading === "idle" && products && (
        <Fragment>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate keyword={keyword ? keyword : ""} pageNumber={pageNumber} />
        </Fragment>
      )}
    </Fragment>
  );
}

export default HomeScreen;
