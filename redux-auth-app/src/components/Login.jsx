import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import "../Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return setError("Email and password required");

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      if (res.data?.user) {
        dispatch(loginSuccess(res.data.user));
        navigate("/profile");
      } else setError("Invalid login");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="link"><a href="/forgot-password">Forgot Password?</a></p>
      <p className="link">Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}
