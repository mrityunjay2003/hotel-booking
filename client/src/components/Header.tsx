
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from './SignOutButton';
const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="navbar bg-white shadow-md">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl text-gray-800">
          Roam Rendezvous
        </Link>
      </div>

      <div className="navbar-end">
        {isLoggedIn ? (
          <>
            <Link
              to="/my-bookings"
              className="btn btn-outline btn-primary mr-2"
            >
              My Bookings
            </Link>
            <Link to="/my-hotels" className="btn btn-outline btn-primary mr-2">
              My Hotels
            </Link>
            <SignOutButton />
            
          </>
        ) : (
          <Link to="/sign-in" className="btn btn-outline btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
