import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';
import Typed from 'typed.js';

const Header: React.FC = () => {
  const { isLoggedIn } = useAppContext();
  const typedElementRef = useRef<HTMLSpanElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (typedElementRef.current) {
      const options = {
        strings: ["Roam Rendezvous"],
        typeSpeed: 100,
        backSpeed: 50,
        showCursor: false,
        startDelay: 300,
      };

      const typed = new Typed(typedElementRef.current, options);

      return () => {
        typed.destroy();
      };
    }
  }, [location]);

  return (
    <div className="navbar bg-white shadow-md">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl text-gray-800">
          <span ref={typedElementRef}></span>
        </Link>
      </div>

      <div className="navbar-end">
        {isLoggedIn ? (
          <>
            <Link to="/my-bookings" className="btn btn-outline btn-primary mr-2">
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
