import React, { Fragment, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";

import Message from "../components/ui/Message";
import Meta from "../components/ui/Meta";
import Paginate from "../components/ui/Paginate";
import useUserRequests from "../hooks/useUserRequests";

function UserListScreen() {
  const { getUsers, deleteUser } = useUserRequests();
  const { users } = useSelector((state) => state.user);
  const { isLoading, error } = useSelector((state) => state.shared);

  const pageNumber = useParams().pageNumber || 1;

  useEffect(() => {
    getUsers(pageNumber);
  }, [getUsers, pageNumber]);

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteUser(id).then(() => getUsers(pageNumber));
    }
  };

  return (
    <Fragment>
      <Meta title="Admin | Users | ProShop" />
      <h1>Users</h1>
      {error && <Message variant="danger" error={error} />}
      {isLoading === "idle" && users.length !== 0 && (
        <Fragment>
          <Table striped bordered responsive hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteUserHandler(user._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pageNumber={pageNumber} isAdmin={true} type="userlist" />
        </Fragment>
      )}
    </Fragment>
  );
}

export default UserListScreen;
