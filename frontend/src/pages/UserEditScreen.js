import React, { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import FormContainer from "../components/ui/FormContainer";
import Message from "../components/ui/Message";
import Meta from "../components/ui/Meta";
import useUserRequests from "../hooks/useUserRequests";

function UserEditScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { user_id: userId } = useParams();
  const { getUserById, updateUserById } = useUserRequests();
  const { user } = useSelector((state) => state.user);
  const { error, isLoading, success } = useSelector((state) => state.shared);

  useEffect(() => {
    if (!user.name || userId !== user._id) {
      getUserById(userId);
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [getUserById, user, userId]);

  const submitHandler = (event) => {
    event.preventDefault();
    updateUserById(userId, { name, email, isAdmin });
  };

  return (
    <Fragment>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {success && (
          <Message dismissType="s" variant="success">
            Profile Updated
          </Message>
        )}
        {error && <Message dismissType="e" variant="danger" error={error} />}
        {isLoading === "idle" && user.name && (
          <Form onSubmit={submitHandler}>
            <Meta title={`Admin | Edit ${user.name} profile | ProShop`} />
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Type your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Type your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="isAdmin" className="my-3">
              <Form.Check
                type="checkbox"
                name="isAdmin"
                label="Is Admin?"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
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

export default UserEditScreen;
