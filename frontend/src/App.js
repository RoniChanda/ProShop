import React, { Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import ErrorPage from "./components/layout/ErrorPage";
import RootLayout from "./components/layout/RootLayout";

//! Lazy Loading
const HomeScreen = React.lazy(() => import("./pages/HomeScreen"));
const ProductScreen = React.lazy(() => import("./pages/ProductScreen"));
const CartScreen = React.lazy(() => import("./pages/CartScreen"));
const LoginScreen = React.lazy(() => import("./pages/LoginScreen"));
const RegisterScreen = React.lazy(() => import("./pages/RegisterScreen"));
const ProfileScreen = React.lazy(() => import("./pages/ProfileScreen"));
const ShippingScreen = React.lazy(() => import("./pages/ShippingScreen"));
const PaymentScreen = React.lazy(() => import("./pages/PaymentScreen"));
const PlaceOrderScreen = React.lazy(() => import("./pages/PlaceOrderScreen"));
const OrderScreen = React.lazy(() => import("./pages/OrderScreen"));
const UserListScreen = React.lazy(() => import("./pages/UserListScreen"));
const UserEditScreen = React.lazy(() => import("./pages/UserEditScreen"));
const ProductListScreen = React.lazy(() => import("./pages/ProductListScreen"));
const ProductEditScreen = React.lazy(() => import("./pages/ProductEditScreen"));
const OrderListScreen = React.lazy(() => import("./pages/OrderListScreen"));

function App() {
  const { userInfo } = useSelector((state) => state.user);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/search?/:keyword?/page?/:pageNumber?",
          element: <HomeScreen />,
        },
        { path: "product/:product_id", element: <ProductScreen /> },
        { path: "cart/:product_id?", element: <CartScreen /> },
        { path: "login", element: <LoginScreen /> },
        { path: "register", element: <RegisterScreen /> },
        {
          path: "profile",
          element: userInfo ? <ProfileScreen /> : <Navigate to="/login" />,
        },
        {
          path: "shipping",
          element: userInfo ? <ShippingScreen /> : <Navigate to="/login" />,
        },
        {
          path: "payment",
          element: userInfo ? <PaymentScreen /> : <Navigate to="/login" />,
        },
        {
          path: "placeorder",
          element: userInfo ? <PlaceOrderScreen /> : <Navigate to="/login" />,
        },
        {
          path: "order/:order_id",
          element: userInfo ? <OrderScreen /> : <Navigate to="/login" />,
        },
        {
          path: "admin/userlist/:pageNumber?",
          element:
            userInfo && userInfo.isAdmin ? (
              <UserListScreen />
            ) : (
              <Navigate to="/login" />
            ),
        },
        {
          path: "admin/user/:user_id/edit",
          element:
            userInfo && userInfo.isAdmin ? (
              <UserEditScreen />
            ) : (
              <Navigate to="/login" />
            ),
        },
        {
          path: "admin/productlist/:pageNumber?",
          element:
            userInfo && userInfo.isAdmin ? (
              <ProductListScreen />
            ) : (
              <Navigate to="/login" />
            ),
        },
        {
          path: "admin/product/:product_id/edit",
          element:
            userInfo && userInfo.isAdmin ? (
              <ProductEditScreen />
            ) : (
              <Navigate to="/login" />
            ),
        },
        {
          path: "admin/orderlist/:pageNumber?",
          element:
            userInfo && userInfo.isAdmin ? (
              <OrderListScreen />
            ) : (
              <Navigate to="/login" />
            ),
        },
      ],
    },
  ]);

  return (
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
