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
    <div className="payment-container">

      <div className="payment-card">

        <div className="success-icon">✔</div>

        <h2>Payment Successful</h2>

        <p>Your booking has been confirmed.</p>

        <div className="payment-details">
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p><strong>Amount Paid:</strong> ₹{amount}</p>
          <p className="status">Status: PAID</p>
        </div>

        <button className="btn-dashboard" onClick={goDashboard}>
          Go to Dashboard
        </button>

      </div>

    </div>
  );
}

export default PaymentSuccess;
