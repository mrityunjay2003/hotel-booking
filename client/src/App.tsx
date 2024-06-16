import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import Layout from "./layouts/Layout";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";
import MyHotels from "./pages/MyHotels";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

const App = () => {
  const { isLoggedIn } = useAppContext();
  const router = createBrowserRouter([
    {
      path: "/",

      element: <Layout>Home Page</Layout>,
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
      path: "/my-hotels",
      element: isLoggedIn && (
        <Layout>
          <MyHotels />
        </Layout>
      ),
    },
    {
      path: "/edit-hotel/:hotelId",
      element: (
        <Layout>
          <EditHotel />
        </Layout>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
