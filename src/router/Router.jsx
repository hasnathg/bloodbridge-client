import {createBrowserRouter} from "react-router";
import Home from "../components/home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import PrivateRoute from "../privateroute/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboardpages/DashboardHome";
import Profile from "../pages/dashboardpages/Profile";
import Users from "../pages/dashboardpages/Users";
import MyDonations from "../pages/dashboardpages/MyDonations";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      }
    ]
  },
  {
    path: "/",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: 'login',
        element: <Login></Login>

      },
      {
        path: 'register',
        element:<Register></Register>
      },
    ]
  },
  {
  path: "/dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <DashboardHome /> },
    { path: "profile", element: <Profile /> },
    { path: "users", element: <Users /> }, 
    { path: "my-donations", element: <MyDonations /> }, 
  ],
}
]);