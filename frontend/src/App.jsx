import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import toast from "react-hot-toast";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Navbar } from "./components/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
export const App = () => {
  const { user } = useAuthContext();
  return (
    <div
      data-theme="coffee"
      className="w-full min-h-screen"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Navbar />
      {/* <button className="btn" onClick={() => toast.success("Hello!")}></button>
      <button className="btn" onClick={() => toast.success("Hello!")}>
        Show Toast
      </button> */}
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};
