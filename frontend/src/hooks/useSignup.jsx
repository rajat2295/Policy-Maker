import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { jwtDecode } from "jwt-decode";
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const signupWithGoogle = async (refId, token) => {
    setIsLoading(true);
    setError(null);
    const decoded = jwtDecode(token);
    if (decoded.email_verified) {
      const email = decoded.email;
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/user/google-signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refId, email }),
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
      setIsLoading(false);
      return;
    }
  };
  const signup = async (email, password, refId) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, refId }),
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
  };
  return { signup, signupWithGoogle, isLoading, error };
};
