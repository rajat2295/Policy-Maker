import React from "react";
import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import toast from "react-hot-toast";

export const App = () => {
  return (
    <div
      data-theme="coffee"
      className="w-full min-h-screen"
      style={{ width: "100vw", height: "100vh" }}
    >
      <button className="btn" onClick={() => toast.success("Hello!")}></button>
      <button className="btn" onClick={() => toast.success("Hello!")}>
        Show Toast
      </button>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};
