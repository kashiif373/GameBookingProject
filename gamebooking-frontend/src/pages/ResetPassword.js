import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ SIMPLE REGEX (ONLY LENGTH)
  const passwordRegex = /^.{6,15}$/;

  const validate = (name, value, updatedForm) => {
    let newErrors = { ...errors };

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        newErrors.password = "Password must be 6 to 15 characters";
      } else {
        delete newErrors.password;
      }
    }

    if (name === "confirmPassword" || name === "password") {
      if (
        updatedForm.confirmPassword &&
        updatedForm.password !== updatedForm.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const updatedForm = {
      ...form,
      [e.target.name]: e.target.value
    };

    setForm(updatedForm);
    validate(e.target.name, e.target.value, updatedForm);
  };

  const resetPassword = async () => {
    if (Object.keys(errors).length > 0) return;

    if (!form.email || !form.otp || !form.password || !form.confirmPassword) {
      setErrors({ general: "Please fill all fields" });
      return;
    }

    try {
      setLoading(true);

      await API.post("/Users/verify-otp", {
        email: form.email,
        otp: form.otp,
        newPassword: form.password
      });

      setSuccessMsg("Password reset successful!");

      setTimeout(() => navigate("/login"), 2000);

    } catch {
      setErrors({ general: "Invalid or expired OTP" });
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

          {/* PASSWORD */}
          <div className="password-wrapper">
            <input
              className="reset-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
               minLength={6}
                maxLength={15}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* CONFIRM PASSWORD */}
          <div className="password-wrapper">
            <input
              className="reset-input"
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
               minLength={6}
                maxLength={15}
            />
            <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}

          <button className="reset-btn" onClick={resetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {errors.general && <p className="error-text">{errors.general}</p>}
          {successMsg && <p className="success-text">{successMsg}</p>}

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;