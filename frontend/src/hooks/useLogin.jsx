import { useAuthContext } from "./useAuthContext";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const loginWithGoogle = async (credToken) => {
    setIsLoading(true);
    setError(null);
    // verify the token with google and get the email
    const decoded = jwtDecode(credToken);
    if (decoded.email_verified) {
      const email = decoded.email;
      const response = await fetch(
        "http://localhost:3000/api/user/verifyEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(json));
        // update the auth context
        dispatch({ type: "LOGIN", payload: json });
      } else {
        setError(json.error);
      }
      setIsLoading(false);
      return json;
    } else {
      setError("Google email not verified");
    }
  };
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));
      // update the auth context
      dispatch({ type: "LOGIN", payload: json });
    } else {
      setError(json.error);
    }
    setIsLoading(false);
    return json;
  };

  return { login, isLoading, error, loginWithGoogle };
};
