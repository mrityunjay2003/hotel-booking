import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layouts/Layout";
import AddHotel from "./pages/AddHotel";
import Booking from "./pages/Booking";
import Detail from "./pages/Detail";
import EditHotel from "./pages/EditHotel";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import MyHotels from "./pages/MyHotels";
import Register from "./pages/Register";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/sign-in",
    element: (
      <Layout showSearchBar={false}>
        <SignIn />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout showSearchBar={false}>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/add-hotel",
    element: (
      <ProtectedRoute>
        <Layout>
          <AddHotel />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-bookings",
    element: (
      <ProtectedRoute>
        <Layout>
          <MyBookings />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-hotels",
    element: (
      <ProtectedRoute>
        <Layout>
          <MyHotels />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-hotel/:hotelId",
    element: (
      <ProtectedRoute>
        <Layout>
          <EditHotel />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <Layout>
        <Search />
      </Layout>
    ),
  },
  {
    path: "/detail/:hotelId",
    element: (
      <Layout>
        <Detail />
      </Layout>
    ),
  },
  {
    path: "/hotel/:hotelId/booking",
    element: (
      <ProtectedRoute>
        <Layout>
          <Booking />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
