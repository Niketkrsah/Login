import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../Login.css";

export default function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="login-container">
      <h2>Profile</h2>
      <img src={`http://localhost:5000/uploads/${user.photo}`} alt="Profile" width={150} />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Mobile:</strong> {user.mobile}</p>
      <button onClick={handleLogout} style={{ background: "crimson" }}>Logout</button>
    </div>
  );
}
