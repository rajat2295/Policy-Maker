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
    <div>
      <form className="signup" onSubmit={handleSubmit}>
        <h3 className="">Login</h3>
        <label cla>Email:</label>
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
        <button disabled={isLoading}>Log in</button>
        <GoogleLogin
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
