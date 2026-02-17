import React, { use } from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import toast from "react-hot-toast";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Navbar } from "./components/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import posthog from "posthog-js";

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthContext();
  const tabs = [
    { label: "Highlights", id: 0 },
    { label: "Evidence", id: 1 },
    { label: "Communication", id: 2 },
    { label: "Type", id: 3 },
  ];
  useEffect(() => {
    console.log(
      "Identifying user in PostHog:",
      user?.email || "anonymous_user",
    );
    posthog.identify(
      user?.email || "anonymous_user", // Replace 'distinct_id' with your user's unique identifier
      { email: user?.email || "anonymous_user" }, // optional: set additional person properties
    );
  }, [user?.email]);
  useEffect(() => {
    ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <div
      data-theme="coffee"
      className="w-full min-h-screen"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* <button className="btn" onClick={() => toast.success("Hello!")}></button>
      <button className="btn" onClick={() => toast.success("Hello!")}>
        Show Toast
      </button> */}
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <HomePage
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {tabs.map((tab) => (
            <Route
              key={tab.id}
              path={`/${tab.label.toLowerCase()}`}
              element={
                user ? (
                  <HomePage
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeTab={tab.id}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          ))}

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
    </div>
  );
};
