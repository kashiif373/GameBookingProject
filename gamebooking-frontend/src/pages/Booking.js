import React, { useEffect, useState } from "react";
import API from "../services/api";
import { logout, isAuthenticated, getUserInfo } from "../services/api";
import "./Booking.css";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();

  const [location, setLocation] = useState({});
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // NEW STATES
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");
  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) setUser(getUserInfo());
  };

  const loadData = async () => {
    try {
      const locRes = await API.get(`/Locations/${gameId}`);
      const selectedLoc = locRes.data.find(
        (l) => l.locationId == locationId
      );
      setLocation(selectedLoc);

      const foodRes = await API.get("/Foods");
      setFoods(foodRes.data);

      const storedFoods =
        JSON.parse(localStorage.getItem("selectedFoods")) || {};

      Object.keys(storedFoods).forEach((id) => {
        storedFoods[id] = Number(storedFoods[id]);
      });

      setSelectedFoods(storedFoods);

      calculateTotal(
        selectedLoc.pricePerHour,
        foodRes.data,
        storedFoods
      );
    } catch {
      alert("Error loading booking data");
    }
  };

  const calculateTotal = (locPrice, foodsList, selected) => {
    let totalAmount = Number(locPrice);

    foodsList.forEach((food) => {
      if (selected[food.foodId] > 0) {
        totalAmount += food.price * selected[food.foodId];
      }
    });

    setTotal(totalAmount);
  };

  const confirmBooking = async () => {
    if (!bookingDate || !timeSlot) {
      alert("Please select booking date and time slot");
      return;
    }

    try {
      const bookingData = {
        userId: parseInt(userId),
        gameId: parseInt(gameId),
        locationId: parseInt(locationId),
        bookingDate: bookingDate,
        timeSlot: timeSlot,
        totalAmount: total,
        paymentStatus: "Pending",
      };

      const res = await API.post("/Bookings", bookingData);
      const bookingId = res.data.bookingId;

      for (const foodId in selectedFoods) {
        if (selectedFoods[foodId] > 0) {
          await API.post("/BookingFoods", {
            bookingId: parseInt(bookingId),
            foodId: parseInt(foodId),
            quantity: selectedFoods[foodId],
          });
        }
      }

      localStorage.setItem("bookingId", bookingId);
      localStorage.setItem("totalAmount", total);

      navigate("/payment");
    } catch {
      alert("Booking failed");
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <div className="booking-page">

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

      <div className="booking-content">
        <div className="booking-container">
          <h2 className="booking-title">Booking Summary</h2>

          <div className="summary-card">

            <div className="summary-section">
              <h4>📍 Location Details</h4>
              <div className="summary-item">
                <span>{location.locationName}</span>
                <span className="price">₹{location.pricePerHour}</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-section">
              <h4>🍕 Selected Foods</h4>
              {foods.map(
                (food) =>
                  selectedFoods[food.foodId] > 0 && (
                    <div key={food.foodId} className="summary-item food-item">
                      <span>{food.foodName}</span>
                      <span>x {selectedFoods[food.foodId]}</span>
                    </div>
                  )
              )}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-section">
              <h4>📅 Select Date & Time</h4>

              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <div className="form-group">
                <label>Time Slot:</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="slot-select"
                >
                  <option value="">Select Slot</option>
                  <option value="Morning">Morning (6AM - 12PM)</option>
                  <option value="Afternoon">Afternoon (12PM - 6PM)</option>
                  <option value="Evening">Evening (6PM - 11PM)</option>
                </select>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="total-section">
              <span>Total Amount:</span>
              <span className="total-amount">₹{total}</span>
            </div>

            <button className="confirm-btn" onClick={confirmBooking}>
              Confirm Booking →
            </button>

          </div>

          <button className="back-btn" onClick={() => navigate("/foods")}>
            ← Add More Food
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 GameZone Booking System</p>
      </footer>

    </div>
  );
}

export default Booking;
