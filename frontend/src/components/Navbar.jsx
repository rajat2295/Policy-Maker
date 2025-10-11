import React from "react";
import { Link } from "react-router";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
export const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const hanleLogout = () => {
    logout();
  };
  return (
    <header className="w-full p-4 bg-slate-800 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">Policy Maker</h1>
      <nav className="space-x-4">
        {user && (
          <div>
            <span className="mr-2"> {user && `Hello, ${user.email}`}</span>
            <button onClick={hanleLogout} className="">
              Logout
            </button>
          </div>
        )}
        <Link to="/" className="hover:underline">
          Surveys
        </Link>
        {!user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
