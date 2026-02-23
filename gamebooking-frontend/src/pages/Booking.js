import React, { useEffect, useState } from "react";
import API, { isAuthenticated, getUserInfo } from "../services/api";
import "./Booking.css";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const userInfo = getUserInfo();
  const userId = userInfo?.userId;
  const locationId = localStorage.getItem("locationId");
  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    window.scrollTo(0, 0);
    checkAuth();
    loadData();
  }, []);

  useEffect(() => {
    if (location && foods) {
      calculateTotal(location.pricePerHour, foods, selectedFoods);
    }
  }, [location, foods, selectedFoods]);

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

      if (!selectedLoc) {
        alert("Location not found.");
        navigate("/locations");
        return;
      }

      setLocation(selectedLoc);

      const foodRes = await API.get("/Foods");
      setFoods(foodRes.data);

      const storedFoods =
        JSON.parse(localStorage.getItem("selectedFoods")) || {};

      Object.keys(storedFoods).forEach((id) => {
        storedFoods[id] = Number(storedFoods[id]);
      });

      setSelectedFoods(storedFoods);

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

  // ⭐ FETCH BOOKED SLOTS (NORMALIZED)
  const fetchBookedSlots = async (date, locId) => {
    try {
      const res = await API.get(
        `/Bookings/slots?locationId=${locId}&date=${date}`
      );

      const normalized = res.data.map((slot) => {
        let value = "";

        if (typeof slot === "string") value = slot;
        else if (slot.timeSlot) value = slot.timeSlot;

        return value.trim().split(" ")[0]; // extract Morning/Afternoon/Evening
      });

      setBookedSlots(normalized);

    } catch {
      console.log("Error loading booked slots");
    }
  };

  const confirmBooking = async () => {
    if (!userId) {
      alert("Please login again");
      return;
    }

    if (!bookingDate || !timeSlot) {
      alert("Please select date & slot");
      return;
    }

    try {
      const bookingData = {
        userId: Number(userId),
        gameId: Number(gameId),
        locationId: Number(locationId),
        bookingDate: new Date(bookingDate + "T00:00:00").toISOString(),
        timeSlot: timeSlot,
        totalAmount: total,
        paymentStatus: "Pending",
        paymentMethod: "Online"
      };

      const res = await API.post("/Bookings", bookingData);
      const bookingId = res.data.bookingId;

      localStorage.setItem("bookingId", bookingId);
      localStorage.setItem("totalAmount", total);

      navigate("/payment");

    } catch (err) {
      alert(err.response?.data || "Booking failed");
    }
  };

  return (
    <div className="booking-page">

      <nav className="navbar">
        <div className="nav-logo">Playeato</div>
      </nav>

      <div className="booking-content">
        <div className="booking-container">
          <h2 className="booking-title">Booking Summary</h2>

          <div className="summary-card">

            {/* LOCATION */}
            <div className="summary-section">
              <h4>📍 Location</h4>
              {location && (
                <div className="summary-item">
                  <span>{location.locationName}</span>
                  <span className="price">₹{location.pricePerHour}</span>
                </div>
              )}
            </div>

            <div className="summary-divider"></div>

            {/* FOODS */}
            <div className="summary-section">
              <h4>🍕 Selected Foods</h4>

              {foods.filter(f => selectedFoods[f.foodId] > 0).length === 0 ? (
                <p>No food selected</p>
              ) : (
                foods.map(
                  (food) =>
                    selectedFoods[food.foodId] > 0 && (
                      <div key={food.foodId} className="summary-item">
                        <span>{food.foodName}</span>
                        <span>
                          x {selectedFoods[food.foodId]} — ₹
                          {food.price * selectedFoods[food.foodId]}
                        </span>
                      </div>
                    )
                )
              )}
            </div>

            <div className="summary-divider"></div>

            {/* ⭐ DATE & SLOT (NEW LOGIC) */}
            <div className="summary-section">
              <h4>📅 Select Date & Slot</h4>

              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  fetchBookedSlots(e.target.value, locationId);
                }}
              />

              <select
                value={timeSlot}
                onChange={(e) => {
                  const selected = e.target.value;

                  if (bookedSlots.includes(selected)) {
                    alert("❌ This slot is already full!");
                    setTimeSlot("");
                    return;
                  }

                  setTimeSlot(selected);
                }}
              >
                <option value="">Select Slot</option>
                <option value="Morning">Morning (6AM-12PM)</option>
                <option value="Afternoon">Afternoon (12PM-6PM)</option>
                <option value="Evening">Evening (6PM-11PM)</option>
              </select>
            </div>

            <div className="summary-divider"></div>

            {/* TOTAL */}
            <div className="total-section">
              <span>Total:</span>
              <span className="total-amount">₹{total}</span>
            </div>

            <button
              className="confirm-btn"
              disabled={!bookingDate || !timeSlot}
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