import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../layouts/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
  },

  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/register',
    element:<Register/>
  },

  {
    path:'/admin',
    element:<Dashboard/>
  }
  
]);
