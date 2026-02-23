import React, { useEffect, useState } from "react";
import API, { getUserInfo } from "../services/api";
import "./Booking.css";
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

  // LOCAL DATE FIX
  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location && foods) {
      calculateTotal(location.pricePerHour, foods, selectedFoods);
    }
  }, [location, foods, selectedFoods]);

  // LOAD ALL DATA
  const loadData = async () => {
    try {
      // GAME
      const gameRes = await API.get("/Games");
      const selectedGame = gameRes.data.find(g => g.gameId == gameId);
      setGame(selectedGame);

      // LOCATION
      const locRes = await API.get(`/Locations/${gameId}`);
      const selectedLoc = locRes.data.find(l => l.locationId == locationId);
      setLocation(selectedLoc);

      // FOODS
      const foodRes = await API.get("/Foods");
      setFoods(foodRes.data);

      const storedFoods =
        JSON.parse(localStorage.getItem("selectedFoods")) || {};
      setSelectedFoods(storedFoods);

    } catch {
      alert("Error loading booking data");
    }
  };

  // TOTAL CALCULATION
  const calculateTotal = (locPrice, foodsList, selected) => {
    let totalAmount = Number(locPrice);

    foodsList.forEach(food => {
      if (selected[food.foodId] > 0) {
        totalAmount += food.price * selected[food.foodId];
      }
    });

    setTotal(totalAmount);
  };

  // FETCH BOOKED SLOTS
  const fetchBookedSlots = async (date, locId) => {
    try {
      const res = await API.get(
        `/Bookings/slots?locationId=${locId}&date=${date}`
      );

      const normalized = res.data.map(slot => {
        let value = typeof slot === "string" ? slot : slot.timeSlot;
        return value.trim().split(" ")[0];
      });

      setBookedSlots(normalized);
      setTimeSlot("");

    } catch {
      console.log("Error loading slots");
    }
  };

  // FILTER AVAILABLE SLOTS
  const availableSlots = allSlots.filter(
    slot => !bookedSlots.includes(slot)
  );

  // CONFIRM BOOKING
  const confirmBooking = async () => {
    if (!bookingDate || !timeSlot) {
      alert("Please select date & slot");
      return;
    }

    if (bookingDate < getTodayDate()) {
      alert("Cannot book past date");
      return;
    }

    try {
      const bookingData = {
        userId: Number(userId),
        gameId: Number(gameId),
        locationId: Number(locationId),
        bookingDate: new Date(bookingDate + "T00:00:00").toISOString(),
        timeSlot,
        totalAmount: total,
        paymentStatus: "Pending",
        paymentMethod: "Online"
      };

      const res = await API.post("/Bookings", bookingData);

      localStorage.setItem("bookingId", res.data.bookingId);
      localStorage.setItem("totalAmount", total);

      navigate("/payment");

    } catch {
      alert("Booking failed");
    }
  };

  return (
    <div className="booking-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">Playeato</div>
      </nav>

      <div className="booking-content">
        <div className="booking-container">
          <h2 className="booking-title">Booking Summary</h2>

          <div className="summary-card">

            {/* GAME */}
            {game && (
              <div className="summary-section">
                <h4>🎮 Game</h4>
                <div className="summary-item">
                  <span>{game.gameName}</span>
                </div>
              </div>
            )}

            <div className="summary-divider"></div>

            {/* LOCATION */}
            {location && (
              <div className="summary-section">
                <h4>📍 Location</h4>
                <div className="summary-item">
                  <span>{location.locationName}</span>
                  <span className="price">₹{location.pricePerHour}</span>
                </div>
              </div>
            )}

            <div className="summary-divider"></div>

            {/* FOODS */}
            <div className="summary-section">
              <h4>🍕 Selected Foods</h4>

              {foods.filter(f => selectedFoods[f.foodId] > 0).length === 0 ? (
                <p className="no-foods">No food selected</p>
              ) : (
                foods.map(
                  food =>
                    selectedFoods[food.foodId] > 0 && (
                      <div key={food.foodId} className="food-item">
                        {food.foodName} x {selectedFoods[food.foodId]}
                      </div>
                    )
                )
              )}
            </div>

            <div className="summary-divider"></div>

            {/* DATE + SLOT */}
            <div className="summary-section">
              <h4>📅 Select Date & Slot</h4>

              <input
                type="date"
                className="date-input"
                min={getTodayDate()}
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  fetchBookedSlots(e.target.value, locationId);
                }}
              />

              {bookingDate && availableSlots.length === 0 ? (
                <p className="no-slots">
                  ❌ All slots are booked for this date
                </p>
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

            <div className="summary-divider"></div>

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