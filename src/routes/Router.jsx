import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../layouts/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminRoute from "./AdminRoute";
// import Users from "../pages/Admin/Users";
import PrivateRoute from "./PrivateRoute.";
// import History from "../pages/History";
import Payment from "../pages/Admin/Payment";
import Banner from "../pages/Admin/Banner";
import Order from "../pages/Order";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // {
  //   path: "/payment-history",
  //   element: <History/>
  // },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <PrivateRoute> <AdminRoute> <Dashboard /></AdminRoute></PrivateRoute>,
    children: [
      // {
      //   path: "users", // relative path, becomes /admin/users
      //   element: <AdminRoute><Users /></AdminRoute> ,
      // },
      {
        path: "payment", // relative path, becomes /admin/users
        element: <AdminRoute><Payment /></AdminRoute> 
      },
      {
        path: "banner", // relative path, becomes /admin/users
        element: <AdminRoute><Banner /></AdminRoute> ,
      },
    ],
  },
]);