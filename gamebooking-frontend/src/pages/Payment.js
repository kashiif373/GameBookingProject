import React, { useState } from "react";
import API from "../services/api";
import "./Payment.css";
import { useNavigate } from "react-router-dom";

function Payment() {

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const bookingId = localStorage.getItem("bookingId");
  const totalAmount = localStorage.getItem("totalAmount"); // from booking page

  const makePayment = async () => {
    try {

      const res = await API.post(`/Payments/${bookingId}`);

      setMessage("Payment Successful!");

      // SAVE amount for success page
      localStorage.setItem("paymentAmount", totalAmount);

      // Navigate to success page
      setTimeout(() => navigate("/payment-success"), 1500);

    } catch (error) {
      console.error(error);
      setMessage("Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment-container">

      <div className="payment-card">

        <h2>Complete Payment</h2>

        <p className="mt-3">
          Booking ID: <b>{bookingId}</b>
        </p>

        <p>
          Amount to Pay: <b>₹{totalAmount}</b>
        </p>

        <button className="btn btn-success mt-3" onClick={makePayment}>
          Pay Now
        </button>

        {message && (
          <div className="alert alert-info mt-4">
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default Payment;
