import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import Footer from "./Footer";
import Header from "./Header";

function RootLayout() {
  return (
    <Fragment>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </Fragment>
  );
}

export default RootLayout;
