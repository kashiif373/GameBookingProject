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
      const res = await API.post("/Users/login", {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("isEligible", res.data.isEligible);

      setMessage("Login successful 🎉");

      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (error) {
      setMessage("Invalid credentials ❌");
    }
  };

  return (
  <div className="login-wrapper">

    {/* LEFT SIDE BRAND PANEL */}
    <div className="login-left">
      <h1 className="brand-title">Welcome Back 👋</h1>
      <p className="brand-subtitle">
        Secure login to access your dashboard and manage your account.
      </p>
    </div>

    {/* RIGHT SIDE LOGIN FORM */}
    <div className="login-right">
      <div className="login-card">

        <h3 className="login-title">User Login</h3>

        {message && (
          <div className="alert-box">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <input
            className="custom-input"
            placeholder="Enter Email"
            name="email"
            onChange={handleChange}
            required
          />

          <input
            className="custom-input"
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={handleChange}
            required
          />

          <button className="login-btn">Login</button>

        </form>

        <p className="register-text">
          Don't have an account?
          <Link to="/register" className="register-link"> Register</Link>
        </p>

      </div>
    </div>

  </div>
);

}

export default Login;
