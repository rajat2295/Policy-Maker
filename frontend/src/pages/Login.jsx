import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "../hooks/useAuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle, error, isLoading } = useLogin();
  const { dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  const googleSuccess = async (res) => {
    await loginWithGoogle(res.credential);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
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
        <button
          disabled={isLoading}
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-teal-600 text-white font-bold shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        <div className="w-full flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-500">or</span>
          <GoogleLogin
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
