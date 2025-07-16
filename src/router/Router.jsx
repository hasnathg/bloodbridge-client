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
import DonationRequestsPage from "../pages/donation/DonationRequestsPage";
import Blogpage from "../pages/blog/Blogpage";
import SearchDonorPage from "../pages/search/SearchDonorPage";
import AllUsers from "../pages/dashboardpages/admin/AllUsers";
import AllDonations from "../pages/dashboardpages/admin/AllDonations";
import ContentManagement from "../pages/dashboardpages/admin/ContentManagement";
import AddBlog from "../pages/dashboardpages/admin/AddBlog";
import MyDonationRequests from "../pages/dashboardpages/donar/MyDonationRequests";
import CreateDonationRequest from "../pages/dashboardpages/donar/CreateDonationRequest";
import VolunteerDonations from "../pages/dashboardpages/volunteer/VolunteerDonations";
import FundingPage from "../pages/private/FundingPage";
import DonationDetails from "../pages/private/DonationDetails";
import EditDonation from "../pages/dashboardpages/EditDonation";
import BlogDetails from "../pages/blog/BlogDetails";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {index: true, Component: Home,},
      { path: "donation-request", element: <DonationRequestsPage /> },
      { path: "blog", element: <Blogpage /> },
      { path: "blog/:id", element: <BlogDetails /> },
      { path: "search", element: <SearchDonorPage /> },
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

     // Admin
      { path: "all-users", element: <AllUsers/> },
      { path: "all-blood-donation-request", element: <AllDonations /> },
      { path: "content-management", element: <ContentManagement /> },
      { path: "content-management/add-blog", element: <AddBlog /> },

     // Donor
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },
      

      // Volunteer
      { path: "volunteer-donations", element: <VolunteerDonations /> },

      // Shared
      
      { path: "edit-donation/:id", element: <EditDonation></EditDonation> },
  ],
},
     {
    path: "/donation-request/:id",
    element: (
      <PrivateRoute>
        <DonationDetails />
      </PrivateRoute>
    ),
  },

  {
    path: "/funding",
    element: (
      <PrivateRoute>
        <FundingPage />
      </PrivateRoute>
    ),
  },
]);