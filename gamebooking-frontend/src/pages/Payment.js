import React, { useState, useEffect } from "react";
import API from "../services/api";
import { logout, isAuthenticated, getUserInfo } from "../services/api";
import "./Payment.css";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const bookingId = localStorage.getItem("bookingId");
  const totalAmount = localStorage.getItem("totalAmount");

  useEffect(() => {
    window.scrollTo(0, 0);
    checkAuth();
    loadRazorpay();
  }, []);

  const checkAuth = () => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUser(getUserInfo());
    }
  };

  // Load Razorpay script once
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  // Handle Pay on Location
  const handlePayOnLocation = async () => {
    setLoading(true);
    setMessage("");
    setSelectedMethod("payOnLocation");

    try {
      // Update booking status to indicate pay on location
      await API.put(`/Bookings/${bookingId}`, {
        PaymentStatus: "Pending",
        PaymentMethod: "PayOnLocation"
      });

      setMessage("✅ Booking confirmed! Pay on location when you arrive.");
      
      // Clear booking data from localStorage
      localStorage.removeItem("bookingId");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("selectedGame");
      localStorage.removeItem("selectedLocation");
      localStorage.removeItem("selectedDate");
      localStorage.removeItem("selectedTimeSlot");

      // Redirect to home page after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Pay on Location error:", error);
      setMessage("❌ Failed to confirm booking. Please try again.");
    }

    setLoading(false);
  };

  // Handle Pay Later
  const handlePayLater = async () => {
    setLoading(true);
    setMessage("");
    setSelectedMethod("payLater");

    try {
      // Update booking status to indicate pay later
      await API.put(`/Bookings/${bookingId}`, {
        PaymentStatus: "Pending",
        PaymentMethod: "PayLater"
      });

      setMessage("✅ Booking confirmed! You can pay later.");
      
      // Clear booking data from localStorage
      localStorage.removeItem("bookingId");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("selectedGame");
      localStorage.removeItem("selectedLocation");
      localStorage.removeItem("selectedDate");
      localStorage.removeItem("selectedTimeSlot");

      // Redirect to home page after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Pay Later error:", error);
      setMessage("❌ Failed to confirm booking. Please try again.");
    }

    setLoading(false);
  };

  // Initialize Razorpay payment (Pay Now)
  const initializePayment = async () => {
    setLoading(true);
    setMessage("");
    setSelectedMethod("payNow");

    try {
      // Call backend to create order
      const orderRes = await API.post(`/Payments/create-order/${bookingId}`);

      const { orderId, keyId, amount, totalAmount: orderTotalAmount } = orderRes.data;

      // Ensure Razorpay loaded
      if (!window.Razorpay) {
        setMessage("❌ Razorpay SDK not loaded. Refresh page.");
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "Game Booking",
        description: `Booking #${bookingId}`,
        order_id: orderId,

        handler: async function (response) {
          try {
            // Verify payment with backend
            const verifyRes = await API.post(`/Payments/verify/${bookingId}`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.status === "Paid") {
              setMessage("✅ Payment Successful!");
              localStorage.setItem("paymentAmount", orderTotalAmount);

              // Clear booking data from localStorage
              localStorage.removeItem("bookingId");
              localStorage.removeItem("totalAmount");
              localStorage.removeItem("selectedGame");
              localStorage.removeItem("selectedLocation");
              localStorage.removeItem("selectedDate");
              localStorage.removeItem("selectedTimeSlot");

              // Redirect to home page instead of payment-success
              setTimeout(() => {
                navigate("/");
              }, 1500);
            }
          } catch (error) {
            console.error("Verification error:", error);
            setMessage("❌ Payment verification failed.");
          }
        },

        prefill: {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "test@gmail.com",
          contact: localStorage.getItem("userPhone") || "9999999999",
        },

        theme: {
          color: "#4CAF50",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage("❌ Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      setMessage("❌ Failed to initialize payment");
    }

    setLoading(false);
  };

  return (
    <div className="payment-page">

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="nav-logo">Playeato</div>

        <div className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/dashboard")}>Games</button>

          {authenticated && user ? (
            <>
              <span className="user-welcome">Hello, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </nav>

      <div className="payment-content">
        <div className="payment-wrapper">
          <div className="payment-card">
            <h2 className="payment-title">Complete Payment</h2>

            <div className="payment-details">
              <div className="detail-row">
                <span className="detail-label">Booking ID</span>
                <span className="detail-value">#{bookingId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount to Pay</span>
                <span className="detail-value amount">₹{totalAmount}</span>
              </div>
            </div>

            <div className="payment-options">
              <button
                className={`payment-btn pay-now-btn ${selectedMethod === 'payNow' ? 'selected' : ''}`}
                onClick={initializePayment}
                disabled={loading}
              >
                💳 Pay Now (Online)
              </button>

              <button
                className={`payment-btn pay-location-btn ${selectedMethod === 'payOnLocation' ? 'selected' : ''}`}
                onClick={handlePayOnLocation}
                disabled={loading}
              >
                📍 Pay on Location
              </button>

              <button
                className={`payment-btn pay-later-btn ${selectedMethod === 'payLater' ? 'selected' : ''}`}
                onClick={handlePayLater}
                disabled={loading}
              >
                🕐 Pay Later
              </button>
            </div>

            {message && <div className="payment-message">{message}</div>}

            <p className="payment-secure">
              🔒 Secure payments via Razorpay
            </p>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2026 GameZone Booking System</p>
        <p>All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Payment;
