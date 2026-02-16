import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";

const API = "https://product-management-system-dtzj.onrender.com/api/auth/login";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      toast.error("Enter credentials");
      return;
    }

    try {
      await axios.post(API, form);

      localStorage.setItem("auth", JSON.stringify(form));

      toast.success("Login Successful");

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch {
      toast.error("Invalid Login ");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <input
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        No account? <Link to="/signup">Signup</Link>
      </p>

      <ToastContainer />
    </div>
  );
}

export default Login;
