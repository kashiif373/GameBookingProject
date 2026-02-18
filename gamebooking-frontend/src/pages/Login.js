import React, { useState } from "react";
import API from "../services/api";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        `/Users/login?email=${formData.email}&password=${formData.password}`
      );

      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("isEligible", res.data.isEligible);

      setMessage("Login successful");

      // Navigate to dashboard later
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div className="login-container">

      <h3 className="login-title">User Login</h3>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleLogin}>

        <input
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />

        <button className="btn login-btn">Login</button>

      </form>

      <p className="text-center mt-3">
        Don't have an account? <Link to="/register">Register</Link>
      </p>

    </div>
  );
}

export default Login;
