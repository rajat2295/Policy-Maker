import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refId, setRefId] = useState("");
  const { signup, signupWithGoogle, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, refId);
  };

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
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            aria-required="true"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            aria-required="true"
            placeholder="Create a password"
          />
        </div>
        <div>
          <label
            htmlFor="refId"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Reference ID:
          </label>
          <input
            id="refId"
            name="refId"
            type="text"
            minLength={8}
            maxLength={8}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            onChange={(e) => setRefId(e.target.value)}
            value={refId}
            aria-required="true"
            placeholder="8 character reference"
          />
          <span className="text-xs text-gray-500">
            Must be exactly 8 characters
          </span>
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-teal-600 text-white font-bold shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
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
