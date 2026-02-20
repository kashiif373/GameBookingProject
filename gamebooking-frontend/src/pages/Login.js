import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { logout, isAuthenticated, getUserInfo } from "../services/api";

function Login() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUser(getUserInfo());
    }
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/Users/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", res.data.email);

      if (res.data.userId) {
        localStorage.setItem("userId", res.data.userId);
      }

      setMessage(res.data.message || "Login successful 🎉");

      setTimeout(() => navigate("/dashboard"), 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/")}>Playeato</div>

        <div className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/dashboard")}>Games</button>

          {authenticated && user ? (
            <>
              <span className="user-welcome">Hello, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </nav>

      <div className="login-wrapper">

        <div className="login-left">
          <h1 className="brand-title">Welcome Back 👋</h1>
          <p className="brand-subtitle">
            Secure login to access your dashboard and manage your account.
          </p>
        </div>

        <div className="login-right">
          <div className="login-card">

            <h3 className="login-title">User Login</h3>

            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleLogin}>

              <input
                className="custom-input"
                type="email"
                placeholder="Enter Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                className="custom-input"
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="register-text">
              Don't have an account?
              <Link to="/register" className="register-link">
                {" "}Register
              </Link>
            </p>

          </div>
        </div>

      </div>

      <footer className="footer">
        <p>© 2026 GameZone Booking System</p>
        <p>All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Login;
