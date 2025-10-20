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
    <header className="w-full bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-3 py-4 space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          What policymakers value
        </h1>
        <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 w-full sm:w-auto">
          {user ? (
            <>
              <span className="text-sm text-slate-200">{`Hello, ${user.email}`}</span>
              <button
                onClick={hanleLogout}
                className="px-4 py-1 bg-white text-slate-800 rounded-full font-semibold transition-colors hover:bg-slate-100 shadow-sm border border-slate-300"
              >
                Logout
              </button>
              <Link
                to="/"
                className="px-4 py-1 rounded-full font-medium transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Surveys
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1 rounded-full font-medium transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 rounded-full font-medium transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
