import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();

  const bookingId = localStorage.getItem("bookingId");
  const amount = localStorage.getItem("paymentAmount");

  const goDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="success-wrapper">

      <div className="success-card">

        <div className="success-circle">
          ✓
        </div>

        <h2 className="success-title">Payment Successful</h2>

        <p className="success-subtitle">
          Your booking has been confirmed successfully.
        </p>

        <div className="success-details">
          <div>
            <span>Booking ID</span>
            <strong>{bookingId}</strong>
          </div>

          <div>
            <span>Amount Paid</span>
            <strong>₹{amount}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong className="paid-status">PAID</strong>
          </div>
        </div>

        <button className="dashboard-btn" onClick={goDashboard}>
          Go to Dashboard
        </button>

      </div>

    </div>
  );
}

export default PaymentSuccess;
