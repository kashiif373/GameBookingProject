import React, { useState } from "react";
import API from "../services/api";
import "./Register.css";

function Register() {

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

      // Clear form after success
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

 return (
  <div className="register-container">

    <h3 className="register-title">Create Account</h3>

    {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}

    <form onSubmit={handleSubmit}>

      <input
        className="form-control mb-3"
        name="name"
        placeholder="👤 Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        className="form-control mb-3"
        name="email"
        placeholder="📧 Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        className="form-control mb-3"
        name="phone"
        placeholder="📱 Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        className="form-control mb-3"
        name="password"
        placeholder="🔒 Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <select
        className="form-control mb-3"
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

      <div className="form-check mb-3">
        <input
          type="checkbox"
          name="isGpsEnabled"
          className="form-check-input"
          checked={formData.isGpsEnabled}
          onChange={handleChange}
        />
        <label className="form-check-label">
          Use My Current Location (GPS)
        </label>
      </div>

      <button className="btn register-btn">
        Register Now
      </button>

    </form>
  </div>
);

}

export default Register;
