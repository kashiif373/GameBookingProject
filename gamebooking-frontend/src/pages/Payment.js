import React, { useState } from "react";
import API from "../services/api";
import "./Payment.css";
import { useNavigate } from "react-router-dom";

function Payment() {

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const bookingId = localStorage.getItem("bookingId");
  const totalAmount = localStorage.getItem("totalAmount");

  const makePayment = async () => {
    try {

      const res = await API.post(`/Payments/${bookingId}`);

      setMessage("✅ Payment Successful!");

      localStorage.setItem("paymentAmount", totalAmount);

      setTimeout(() => navigate("/payment-success"), 1500);

    } catch (error) {
      console.error(error);
      setMessage("❌ Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment-wrapper">

      <div className="payment-card">

        <h2 className="payment-title">Complete Payment</h2>

        <div className="payment-details">
          <p>
            Booking ID
            <span>{bookingId}</span>
          </p>

          <p>
            Amount to Pay
            <span>₹{totalAmount}</span>
          </p>
        </div>

        <button className="payment-btn" onClick={makePayment}>
          Pay Now
        </button>

        {message && (
          <div className="payment-message">
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default Payment;
