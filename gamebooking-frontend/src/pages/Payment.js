import React, { useState, useEffect } from "react";
import API from "../services/api";
import { isAuthenticated, getUserInfo } from "../services/api";
import "./Payment.css";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const pendingBooking = JSON.parse(localStorage.getItem("pendingBooking"));
  const totalAmount = localStorage.getItem("totalAmount");

  useEffect(() => {
    window.scrollTo(0, 0);

    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) setUser(getUserInfo());

    loadRazorpay();
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  // ================= CREATE BOOKING SAFELY =================
  const createBookingIfNeeded = async () => {
    let bookingId = localStorage.getItem("bookingId");

    // ⭐ Already exists → reuse
    if (bookingId) return bookingId;

    // ⭐ Create new booking
    if (pendingBooking) {
      const res = await API.post("/Bookings", pendingBooking);
      const saved = res.data;
      bookingId = saved.bookingId || saved.id;

      localStorage.setItem("bookingId", bookingId);

      // Add foods
      if (pendingBooking.selectedFoods) {
        for (const [foodId, qty] of Object.entries(
          pendingBooking.selectedFoods
        )) {
          if (qty > 0) {
            await API.post("/BookingFoods", {
              bookingId: bookingId,
              foodId: Number(foodId),
              quantity: qty,
            });
          }
        }
      }
    }

    return bookingId;
  };

  // ================= CLEAR STORAGE =================
  const clearBookingData = () => {
    localStorage.removeItem("bookingId");
    localStorage.removeItem("pendingBooking");
    localStorage.removeItem("totalAmount");
    localStorage.removeItem("selectedGame");
    localStorage.removeItem("selectedLocation");
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("selectedTimeSlot");
    localStorage.removeItem("selectedFoods");
  };

  // ================= PAY ON LOCATION =================
  const handlePayOnLocation = async () => {
    setLoading(true);
    setSelectedMethod("location");

    try {
      const bookingId = await createBookingIfNeeded();

      await API.put(`/Bookings/${bookingId}`, {
        PaymentStatus: "Pending",
        PaymentMethod: "PayOnLocation",
      });

      setMessage("✅ Booking confirmed! Pay on location.");
      clearBookingData();

      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMessage("❌ Failed to confirm booking.");
    }

    setLoading(false);
  };

  // ================= PAY LATER =================
  const handlePayLater = async () => {
    setLoading(true);
    setSelectedMethod("later");

    try {
      const bookingId = await createBookingIfNeeded();

      await API.put(`/Bookings/${bookingId}`, {
        PaymentStatus: "Pending",
        PaymentMethod: "PayLater",
      });

      setMessage("✅ Booking confirmed! You can pay later.");
      clearBookingData();

      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMessage("❌ Failed to confirm booking.");
    }

    setLoading(false);
  };

  // ================= PAY NOW (RAZORPAY) =================
  const handlePayNow = async () => {
    setLoading(true);
    setSelectedMethod("online");

    try {
      const bookingId = await createBookingIfNeeded();

      const orderRes = await API.post(`/Payments/create-order/${bookingId}`);
      const { orderId, keyId, amount } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "Playeato",
        description: `Booking #${bookingId}`,
        order_id: orderId,

        handler: async function (response) {
          await API.post(`/Payments/verify/${bookingId}`, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          setMessage("✅ Payment Successful!");
          clearBookingData();

          setTimeout(() => navigate("/"), 1500);
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setSelectedMethod("");
            setMessage("❌ Payment cancelled. Choose another method.");
          },
        },

        theme: {
          color: "#4CAF50",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setMessage("❌ Payment failed.");
    }

    setLoading(false);
  };

  return (
    <div className="payment-page">
      <div className="payment-content">
        <div className="payment-wrapper">
          <div className="payment-card">
            <h2 className="payment-title">Complete Payment</h2>

            <div className="payment-details">
              <div className="detail-row">
                <span>Amount</span>
                <span className="amount">₹{totalAmount}</span>
              </div>
            </div>

            <div className="payment-options">
              <button
                className="payment-btn"
                onClick={handlePayNow}
                disabled={loading}
              >
                💳 Pay Now
              </button>

              <button
                className="payment-btn"
                onClick={handlePayOnLocation}
                disabled={loading}
              >
                📍 Pay on Location
              </button>

              <button
                className="payment-btn"
                onClick={handlePayLater}
                disabled={loading}
              >
                🕐 Pay Later
              </button>
            </div>

            {message && <div className="payment-message">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;