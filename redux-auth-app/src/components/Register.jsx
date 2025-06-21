import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Login.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "", photo: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).{8,}$/;
    if (form.password !== form.confirmPassword) return setError("Passwords don't match");
    if (!regex.test(form.password)) return setError("Weak password");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));

    try {
      await axios.post("http://localhost:5000/register", data);
      setSuccess("Registered! Redirecting...");
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <input name="name" className="input-field" placeholder="Name" onChange={handleChange} />
      <input name="email" className="input-field" placeholder="Email" onChange={handleChange} />
      <input name="mobile" className="input-field" placeholder="Mobile" onChange={handleChange} />
      <input type="file" name="photo" className="input-field" onChange={handleChange} />
      <input name="password" type="password" className="input-field" placeholder="Password" onChange={handleChange} />
      <input name="confirmPassword" type="password" className="input-field" placeholder="Confirm Password" onChange={handleChange} />
      <button onClick={handleSubmit}>Register</button>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
