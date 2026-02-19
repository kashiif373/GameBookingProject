import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

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
      setError("Registration failed. Please try again.");
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
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
              required
            />

            <input
              className="custom-input"
              name="email"
              placeholder="📧 Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="custom-input"
              name="phone"
              placeholder="📱 Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              className="custom-input"
              name="password"
              placeholder="🔒 Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              className="custom-input"
              name="selectedCity"
              value={formData.selectedCity}
              onChange={handleChange}
              required
            >
              <option value="">🏙️ Select City</option>
              <option value="Patna">Patna</option>
              <option value="Aligarh">Aligarh</option>
              <option value="Other">Other</option>
            </select>

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
  );
}

export default Register;
