import React, { Fragment, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";

import Message from "../components/ui/Message";
import useOrderRequests from "../hooks/useOrderRequests";
import Paginate from "../components/ui/Paginate";
import Meta from "../components/ui/Meta";

function OrderListScreen() {
  const { getAllOrders } = useOrderRequests();
  const { allOrders } = useSelector((state) => state.order);
  const { isLoading, error } = useSelector((state) => state.shared);

  const pageNumber = useParams().pageNumber || 1;

  useEffect(() => {
    getAllOrders(pageNumber);
  }, [getAllOrders, pageNumber]);

  return (
    <Fragment>
      <Meta title="Admin | Orders | ProShop" />
      <h1>Orders</h1>
      {error && <Message dismissType="e" variant="danger" error={error} />}
      {isLoading === "idle" && allOrders.length !== 0 && (
        <Fragment>
          <Table striped bordered responsive hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL PRICE</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : order.outForDelivery ? (
                      "Out for delivery"
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pageNumber={pageNumber} isAdmin={true} type="orderlist" />
        </Fragment>
      )}
    </Fragment>
  );
}

export default OrderListScreen;
