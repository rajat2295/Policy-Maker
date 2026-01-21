import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

/**
 * SignUp Component
 * [COMPONENT_DESCRIPTION]: The registration gateway for the dashboard.
 * Features:
 * 1. Reference-based registration: Requires an 8-character ID for security.
 * 2. Hybrid Sign-up: Supports traditional credentials and Google OAuth.
 * 3. Validation Logic: Disables social signup until the Reference ID is valid.
 */
export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refId, setRefId] = useState("");

  // Functionality: Custom hook handles API interactions and global auth state
  const { signup, signupWithGoogle, error, isLoading } = useSignup();

  /**
   * [AUTH_LOGIC]: handleSubmit
   * Functionality: Submits the registration payload to the server.
   * Includes the 'refId' to ensure the user is authorized to create an account.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, refId);
  };

  /**
   * [AUTH_LOGIC]: googleSuccess
   * Functionality: Passes the Google ID token and the manual RefId to the backend.
   */
  const googleSuccess = async (res) => {
    await signupWithGoogle(refId, res.credential);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <form
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100"
        onSubmit={handleSubmit}
        aria-labelledby="signup-heading"
      >
        <h3
          className="text-2xl font-bold text-slate-800 mb-4 text-center"
          id="signup-heading"
        >
          Sign Up
        </h3>

        {/* Email Input Section */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input Section */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password" // [UX_LOGIC]: Signals to browsers that this is a new credential
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Create a password"
          />
        </div>

        {/* [SECURITY_LOGIC]: Reference ID Field
            Functionality: Enforces an 8-character constraint via minLength/maxLength.
        */}
        <div>
          <label
            htmlFor="refId"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Reference ID:
          </label>
          <input
            id="refId"
            type="text"
            minLength={8}
            maxLength={8}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400 font-mono"
            onChange={(e) => setRefId(e.target.value)}
            value={refId}
            placeholder="8 character reference"
          />
          <span className="text-xs text-gray-500 mt-1 block">
            Must be exactly 8 characters
          </span>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-teal-600 text-white font-bold shadow hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        {/* [UX_LOGIC]: Social Auth Guard
            Functionality: The Google button is logically disabled (via the component's internal state)
            unless the user has entered a valid 8-character Reference ID.
        */}
        <div className="w-full flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-500">or</span>
          <GoogleLogin
            disabled={!(refId && refId.length === 8)}
            onSuccess={googleSuccess}
            onError={() => console.log("Login Failed")}
            theme="outline"
            width="300"
          />
        </div>

        {/* Error Feedback */}
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
