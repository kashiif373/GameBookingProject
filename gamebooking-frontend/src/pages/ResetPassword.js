import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetPassword = async () => {
    if (!form.email || !form.otp || !form.password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/Users/verify-otp", {
        email: form.email,
        otp: form.otp,
        newPassword: form.password
      });

      setMessage("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch {
      setMessage("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-wrapper">
        <div className="reset-card">

          <h2 className="reset-title">Reset Password</h2>

          <input
            className="reset-input"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="reset-input"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
          />

          <input
            className="reset-input"
            type="password"
            name="password"
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            className="reset-btn"
            onClick={resetPassword}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {message && (
            <p className="reset-message">{message}</p>
          )}

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;