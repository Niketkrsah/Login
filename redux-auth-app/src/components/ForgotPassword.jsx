import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Login.css";

export default function ForgotPassword() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleReset = async () => {
    if (Object.values(form).some((val) => !val)) return setError("All fields required");

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).{8,}$/;
    if (!regex.test(form.newPassword)) return setError("Minimum 8 char., one uppercase, one lowercase,one special character @#$%&");

    try {
      await axios.post("http://localhost:5000/reset-password", form);
      setSuccess("Password updated! Redirecting...");
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setError("Reset failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <input name="name" className="input-field" placeholder="Name" onChange={handleChange} />
      <input name="email" className="input-field" placeholder="Email" onChange={handleChange} />
      <input name="mobile" className="input-field" placeholder="Mobile" onChange={handleChange} />
      <input name="newPassword" type="password" className="input-field" placeholder="New Password" onChange={handleChange} />
      <button onClick={handleReset}>Reset Password</button>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
