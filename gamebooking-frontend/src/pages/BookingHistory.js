import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getUserInfo } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./BookingHistory.css";

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

      // ⭐ IMPORTANT: Sort newest first (fallback safety)
      const sorted = res.data.sort(
        (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
      );

      setBookings(sorted);

    } catch (error) {
      console.error(error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-page">
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
          {bookings.map((b) => (
            <div key={b.bookingId} className="history-card">
              <h3>Booking ID: {b.bookingId}</h3>

              <p><strong>Game:</strong> {b.gameName}</p>
              <p><strong>Location:</strong> {b.locationName}</p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(b.bookingDate).toLocaleDateString()}
              </p>

              <p><strong>Time Slot:</strong> {b.timeSlot}</p>
              <p><strong>Total Amount:</strong> ₹{b.totalAmount}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${b.paymentStatus}`}>
                  {b.paymentStatus}
                </span>
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
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>
    </div>
  );
}

export default BookingHistory;