import {createBrowserRouter} from "react-router";
import Home from "../components/home/Home";
import RootLayout from "../layouts/RootLayout";


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
]);