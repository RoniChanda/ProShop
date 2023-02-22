import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col xs="auto" className="p-0">
          <Form.Control
            type="text"
            name="q"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Products here"
            className="mr-sm-2 ml-sm-5"
          ></Form.Control>
        </Col>
        <Col xs="auto" className="p-0">
          <Button
            type="submit"
            variant="outline-success"
            className="btn-search"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBox;
