import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getUserInfo } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./BookingHistory.css";

/* ⭐ SLOT TIME MAP */
const slotTimeMap = {
  Morning: "Morning (6:00 AM – 12:00 PM)",
  Afternoon: "Afternoon (12:00 PM – 6:00 PM)",
  Evening: "Evening (6:00 PM – 11:00 PM)"
};

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = getUserInfo();
  const userId = currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get(`/bookings/history/${userId}`);
      const sorted = res.data.sort((a, b) => b.bookingId - a.bookingId);
      setBookings(sorted);
    } catch (error) {
      console.error(error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await API.put(`/bookings/cancel/${bookingId}`);
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Failed to cancel booking");
    }
  };

  return (
    <div className="history-page">

      {/* BACK BUTTON */}
      <button
        className="back-btn"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate("/dashboard")}
      >
        ← Go Back
      </button>

      <h2 className="history-title">📜 My Booking History</h2>

      {loading ? (
        <p className="loading-text">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="no-bookings-box">
          <h3>No Bookings Yet 😔</h3>
          <p>You haven't made any bookings yet.</p>
          <button
            className="browse-btn"
            onClick={() => navigate("/dashboard")}
          >
            Browse Games →
          </button>
        </div>
      ) : (
        <div className="history-container">
          {bookings.map((b) => {
            const isCancelled = b.paymentStatus === "Cancelled";
            const isPast = new Date(b.bookingDate) < new Date();

            return (
              <div key={b.bookingId} className="history-card">

                <h3>Booking ID: {b.bookingId}</h3>

                <p><strong>Game:</strong> {b.gameName}</p>
                <p><strong>Location:</strong> {b.locationName}</p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(b.bookingDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>Time Slot:</strong>{" "}
                  {slotTimeMap[b.timeSlot] || b.timeSlot}
                </p>

                <p><strong>Total Amount:</strong> ₹{b.totalAmount}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${b.paymentStatus}`}>
                    {b.paymentStatus}
                  </span>
                </p>

                {/* ⭐⭐⭐ NEW PAYMENT METHOD ADDED ⭐⭐⭐ */}
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {b.paymentMethod === "PayNow" && "💳 Online Payment"}
                  {b.paymentMethod === "PayLater" && "🕐 Pay Later"}
                  {b.paymentMethod === "PayOnLocation" && "📍 Pay on Location"}
                  {!b.paymentMethod && "Not Selected"}
                </p>

                {b.foods && b.foods.length > 0 && (
                  <div className="food-history">
                    <strong>Foods Ordered:</strong>
                    <ul>
                      {b.foods.map((f, index) => (
                        <li key={index}>
                          {f.foodName} (x{f.quantity})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isCancelled && !isPast && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(b.bookingId)}
                  >
                    Cancel Booking
                  </button>
                )}

                {isCancelled && (
                  <p className="cancelled-text">❌ Booking Cancelled</p>
                )}

                {isPast && !isCancelled && (
                  <p className="expired-text">⏳ Completed Booking</p>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;