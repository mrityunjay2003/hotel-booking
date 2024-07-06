import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
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

const App = () => {
  const { isLoggedIn } = useAppContext();
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
        <Layout>
          <SignIn />
        </Layout>
      ),
    },
    {
      path: "/register",
      element: (
        <Layout>
          <Register />
        </Layout>
      ),
    },
    {
      path: "/add-hotel",
      element: isLoggedIn && (
        <Layout>
          <AddHotel />
        </Layout>
      ),
    },

    {
      path: "/my-bookings",
      element: isLoggedIn && (
        <Layout>
          <MyBookings />
        </Layout>
      ),
    },
    {
      path: "/my-hotels",
      element: isLoggedIn && (
        <Layout>
          <MyHotels />
        </Layout>
      ),
    },
    {
      path: "/edit-hotel/:hotelId",
      element: isLoggedIn && (
        <Layout>
          <EditHotel />
        </Layout>
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
      element: isLoggedIn && (
        <Layout>
          <Booking />
        </Layout>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
