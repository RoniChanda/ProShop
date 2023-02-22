import React, { Fragment, useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useProductRequests from "../../hooks/useProductRequests";

function ProductCarousel() {
  const { topRatedProducts } = useSelector((state) => state.product);
  const { getTopRatedProducts } = useProductRequests();
  const { isLoading } = useSelector((state) => state.shared);

  useEffect(() => {
    getTopRatedProducts();
  }, [getTopRatedProducts]);

  return (
    <Fragment>
      {isLoading === "idle" && topRatedProducts && (
        <Carousel pause="hover" className="bg-dark">
          {topRatedProducts.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  className="d-block"
                />
                <Carousel.Caption className="carousel-caption">
                  <h2>
                    {product.name} (₹{product.price})
                  </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Fragment>
  );
}

export default ProductCarousel;
