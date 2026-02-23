import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import "./Admin.css";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Load bookings
  const fetchBookings = async () => {
    const res = await API.get("/admin/bookings");
    setBookings(res.data);
  };

  // Cancel booking
  const cancelBooking = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      await API.delete(`/admin/bookings/${id}`);
      fetchBookings();
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-content">
        <h2>Manage Bookings</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingId}>
                <td>{b.bookingId}</td>
                <td>{b.userId}</td>
                <td>{b.locationId}</td>

                {/* Fix date format */}
                <td>{b.bookingDate.split("T")[0]}</td>

                {/* Correct field */}
                <td>{b.timeSlot}</td>

                <td>₹ {b.totalAmount}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => cancelBooking(b.bookingId)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default ManageBookings;