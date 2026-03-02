import React, { useEffect, useState } from "react";
import API, { getUserInfo } from "../services/api";
import "./Booking.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [location, setLocation] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [total, setTotal] = useState(0);

  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const userInfo = getUserInfo();
  const userId = userInfo?.userId;
  const gameId = localStorage.getItem("gameId");
  const locationId = localStorage.getItem("locationId");

  const allSlots = ["Morning", "Afternoon", "Evening"];

  // ================= DATE HELPERS =================
  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setDate(today.getDate() + 90));
    const offset = maxDate.getTimezoneOffset();
    const localDate = new Date(maxDate.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const gameRes = await API.get("/Games");
        setGame(gameRes.data.find(g => g.gameId === Number(gameId)));

        const locRes = await API.get(`/Locations/${gameId}`);
        setLocation(locRes.data.find(l => l.locationId === Number(locationId)));

        const foodRes = await API.get("/Foods");
        setFoods(foodRes.data);

        const storedFoods = JSON.parse(localStorage.getItem("selectedFoods")) || {};
        setSelectedFoods(storedFoods);

      } catch {
        alert("Error loading booking data");
      }
    };

    loadData();
  }, [gameId, locationId]);

  // ================= CALCULATE TOTAL =================
  useEffect(() => {
    if (location && foods) {
      let totalAmount = Number(location.pricePerHour || 0);

      foods.forEach(food => {
        if (selectedFoods[food.foodId] > 0) {
          totalAmount += food.price * selectedFoods[food.foodId];
        }
      });

      setTotal(totalAmount);
      localStorage.setItem("totalAmount", totalAmount);
    }
  }, [location, foods, selectedFoods]);

  // ================= FETCH BOOKED SLOTS =================
  const fetchBookedSlots = async (date, locId) => {
    try {
      const res = await API.get(`/Bookings/slots?locationId=${locId}&date=${date}`);
      const normalized = res.data.map(slot =>
        typeof slot === "string" ? slot : slot.timeSlot
      );
      setBookedSlots(normalized);
      setTimeSlot("");
    } catch {
      console.log("Error loading slots");
    }
  };

  // ================= TIME-BASED SLOT FILTER =================
  const getTimeBasedAvailableSlots = () => {
    const today = getTodayDate();

    if (bookingDate !== today) {
      return allSlots.filter(slot => !bookedSlots.includes(slot));
    }

    const hour = new Date().getHours();

    return allSlots.filter(slot => {
      if (bookedSlots.includes(slot)) return false;
      if (slot === "Morning" && hour >= 12) return false;
      if (slot === "Afternoon" && hour >= 18) return false;
      if (slot === "Evening" && hour >= 23) return false;
      return true;
    });
  };

  const availableSlots = getTimeBasedAvailableSlots();

  // ================= CONFIRM BOOKING =================
  const confirmBooking = () => {
    if (!bookingDate || !timeSlot) {
      alert("Please select date & slot");
      return;
    }

    if (!userId) {
      navigate("/login");
      return;
    }

    const bookingData = {
      userId: Number(userId),
      gameId: Number(gameId),
      locationId: Number(locationId),
      bookingDate,
      timeSlot,
      totalAmount: total,
      selectedFoods,
    };

    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    localStorage.setItem("totalAmount", total);

    navigate("/payment");
  };

  // ================= UI =================
  return (
    <div className="booking-page">
      <div className="booking-content">
        <div className="booking-container">
          <h2 className="booking-title">Booking Summary</h2>

          <div className="summary-card">

            {/* GAME */}
            {game && (
              <div className="summary-section">
                <h4>🎮 Selected Game</h4>
                <div className="summary-item">{game.gameName}</div>
              </div>
            )}

            {/* LOCATION */}
            {location && (
              <div className="summary-section">
                <h4>📍 Selected Location</h4>
                <div className="summary-item">
                  <span>{location.locationName}</span>
                  <span className="price">₹{location.pricePerHour}</span>
                </div>
              </div>
            )}

            {/* FOODS */}
            <div className="summary-section">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>🍕 Selected Foods</h4>
                <button
                  className="add-more-foods-btn"
                  onClick={() => navigate("/foods")}
                >
                  + Add More Foods
                </button>
              </div>

              {foods.filter(f => selectedFoods[f.foodId] > 0).length === 0 ? (
                <p className="no-foods">No food selected</p>
              ) : (
                foods.map(food =>
                  selectedFoods[food.foodId] > 0 && (
                    <div key={food.foodId} className="food-item">
                      <span>{food.foodName} × {selectedFoods[food.foodId]}</span>
                      <span>₹{food.price * selectedFoods[food.foodId]}</span>
                    </div>
                  )
                )
              )}
            </div>

            {/* DATE & SLOT */}
            <div className="summary-section">
              <h4>📅 Select Date & Slot</h4>

              <input
                type="date"
                className="date-input"
                min={getTodayDate()}
                max={getMaxDate()}
                value={bookingDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const today = getTodayDate();
                  const maxDate = getMaxDate();

                  if (selectedDate < today) {
                    alert("You cannot book a past date!");
                    setBookingDate("");
                    return;
                  }

                  if (selectedDate > maxDate) {
                    alert("Booking allowed only within 90 days from today!");
                    setBookingDate("");
                    return;
                  }

                  setBookingDate(selectedDate);
                  fetchBookedSlots(selectedDate, locationId);
                }}
              />

              {bookingDate && availableSlots.length === 0 ? (
                <p className="no-slots">All slots unavailable for today</p>
              ) : (
                <select
                  className="slot-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="">Select Slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot === "Morning" && "Morning (6AM-12PM)"}
                      {slot === "Afternoon" && "Afternoon (12PM-6PM)"}
                      {slot === "Evening" && "Evening (6PM-11PM)"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* TOTAL */}
            <div className="total-section">
              <span>Total:</span>
              <span className="total-amount">₹{total}</span>
            </div>

            <button
              className="confirm-btn"
              disabled={!timeSlot}
              onClick={confirmBooking}
            >
              Confirm Booking →
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
