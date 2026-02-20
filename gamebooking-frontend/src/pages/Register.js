import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";
import { logout, isAuthenticated, getUserInfo } from "../services/api";

function Register() {

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
    name: "",
    email: "",
    phone: "",
    password: "",
    selectedCity: "",
    detectedCity: "",
    isGpsEnabled: false
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.selectedCity) {
      errors.selectedCity = "Please select a city";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await API.post("/Users/register", formData);
      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        selectedCity: "",
        detectedCity: "",
        isGpsEnabled: false
      });

    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 400) {
        setError(serverMessage || "Invalid input data.");
      }
      else if (status === 409) {
        setError(serverMessage || "Email already exists.");
      }
      else if (status === 403) {
        setError(serverMessage || "Access denied.");
      }
      else {
        setError("Something went wrong. Please try again.");
      }

      setMessage("");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">

      <div className="register-wrapper">

        <div className="register-left">
          <h1 className="brand-title">Join Us Today 🚀</h1>
          <p className="brand-subtitle">
            Create your account and start managing everything in one secure place.
          </p>
        </div>

        <div className="register-right">
          <div className="register-card">

            <h3 className="register-title">Create Account</h3>

            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit}>

              <input
                className="custom-input"
                name="name"
                placeholder="👤 Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}

              <input
                className="custom-input"
                name="email"
                placeholder="📧 Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}

              <input
                className="custom-input"
                name="phone"
                placeholder="📱 Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}

              <input
                className="custom-input"
                name="password"
                placeholder="🔒 Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}

              <select
                className="custom-input"
                name="selectedCity"
                value={formData.selectedCity}
                onChange={handleChange}
              >
                <option value="">🏙️ Select City</option>
                <option value="Patna">Patna</option>
                <option value="Aligarh">Aligarh</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.selectedCity && <span className="error-text">{validationErrors.selectedCity}</span>}

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="isGpsEnabled"
                  checked={formData.isGpsEnabled}
                  onChange={handleChange}
                />
                <label>Use My Current Location (GPS)</label>
              </div>

              <button type="submit" className="register-btn">
                Register Now
              </button>

              <button 
                type="button" 
                className="back-btn"
                onClick={goToLogin}
              >
                ← Back to Login
              </button>

            </form>

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

export default Register;
