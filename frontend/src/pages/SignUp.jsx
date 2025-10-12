import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
  };

  const googleSuccess = async (res) => {
    console.log(res);
    response = res ? console.log(jwtDecode(res.credential)) : "";
    console.log(response);
    // localStorage.setItem("user", JSON.stringify(res));
    // // update the auth context
    await signup(email, password, refId, res.credential);
    // dispatch({ type: "LOGIN", payload: res });
  };

  const [refId, setRefId] = useState("");

  return (
    <div>
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        <label>Email:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <label>Reference ID:</label>
        <input
          type="text"
          onChange={(e) => setRefId(e.target.value)}
          value={refId}
        />
        <button disabled={isLoading}>Sign Up</button>
        <GoogleLogin
          disabled={!refId}
          onSuccess={(credentialResponse) => {
            googleSuccess(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};
