import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/Users/send-otp", {
        email: email
      });

      setMessage(res.data.message);

      // Redirect to reset page after OTP sent
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);

    } catch (err) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-wrapper">
        <div className="forgot-card">

          <h2 className="forgot-title">Forgot Password</h2>

          <input
            className="forgot-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="forgot-btn"
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {message && <p className="forgot-message">{message}</p>}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;