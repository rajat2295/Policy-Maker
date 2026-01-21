import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "../hooks/useAuthContext";

/**
 * Login Component
 * [COMPONENT_DESCRIPTION]: A secure authentication portal.
 * It provides a dual-entry system:
 * 1. Standard JWT-based email/password authentication.
 * 2. Google OAuth 2.0 integration for a seamless "One Tap" experience.
 */
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Functionality: Extracts methods from custom hook to manage API states (loading, error)
  const { login, loginWithGoogle, error, isLoading } = useLogin();
  const { dispatch } = useAuthContext();

  /**
   * [AUTH_LOGIC]: handleSubmit
   * Functionality: Handles traditional form submission.
   * 'isLoading' state prevents duplicate requests while waiting for the server response.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  /**
   * [AUTH_LOGIC]: googleSuccess
   * Functionality: Triggered after the Google popup closes successfully.
   * It sends the 'credential' (ID Token) to the backend for verification/registration.
   */
  const googleSuccess = async (res) => {
    await loginWithGoogle(res.credential);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      {/* [ACCESSIBILITY]: aria-labelledby 
          Ensures screen readers announce the form purpose upon focus.
      */}
      <form
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100"
        onSubmit={handleSubmit}
        aria-labelledby="login-heading"
      >
        <h3
          className="text-2xl font-bold text-slate-800 mb-4 text-center"
          id="login-heading"
        >
          Login
        </h3>

        {/* Email Input Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username" // [UX_LOGIC]: Helps browsers suggest stored emails
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            aria-required="true"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            aria-required="true"
            placeholder="Enter your password"
          />
        </div>

        {/* Form Submission Button */}
        <button
          disabled={isLoading} // Functionality: Disables button during API call
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-teal-600 text-white font-bold shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        {/* [OAUTH_UI]: Google Login Integration */}
        <div className="w-full flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-500 uppercase">or</span>
          <GoogleLogin
            onSuccess={googleSuccess}
            onError={() => console.log("Login Failed")}
            theme="outline"
            width="300"
          />
        </div>

        {/* [ERROR_HANDLING]: Dynamic Feedback 
            role="alert" ensures screen readers announce error messages immediately.
        */}
        {error && (
          <div
            className="mt-2 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm text-center"
            role="alert"
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
