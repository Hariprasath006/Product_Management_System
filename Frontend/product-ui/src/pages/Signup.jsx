import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import { toast, ToastContainer } from "react-toastify";

const API = "https://product-management-system-dtzj.onrender.com/api/auth/register";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      toast.error("Fill all fields");
      return;
    }

    try {
      await axios.post(API, form);

      toast.success("Account Created");

      setTimeout(() => navigate("/"), 1000);
    } catch {
      toast.error("User already exists ");
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>

      <input
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleSignup}>Create Account</button>

      <p>
        Already have account? <Link to="/">Login</Link>
      </p>

      <ToastContainer />
    </div>
  );
}

export default Signup;
