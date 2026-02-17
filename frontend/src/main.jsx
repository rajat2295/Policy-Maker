import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  loaded: (posthog) => {
    posthog.identify(user?.email || "anonymous_user", {
      email: user?.email || "anonymous_user",
      name: user?.email || "Anonymous User",
    }); // Identify users as anonymous by default
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <PostHogProvider client={posthog}>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </PostHogProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
