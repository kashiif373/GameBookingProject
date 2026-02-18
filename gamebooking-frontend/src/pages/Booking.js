import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./Booking.css";
import { useNavigate } from "react-router-dom";

function Booking() {

  const navigate = useNavigate();

  const [location, setLocation] = useState({});
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [total, setTotal] = useState(0);

  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");
  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load location
      const locRes = await API.get(`/Locations/${gameId}`);
      const selectedLoc = locRes.data.find(l => l.locationId == locationId);
      setLocation(selectedLoc);

      // Load foods
      const foodRes = await API.get("/Foods");
      setFoods(foodRes.data);

      // Load selected foods
      const storedFoods = JSON.parse(localStorage.getItem("selectedFoods")) || {};

      // Convert quantities to numbers
      Object.keys(storedFoods).forEach(id => {
        storedFoods[id] = Number(storedFoods[id]);
      });

      setSelectedFoods(storedFoods);

      calculateTotal(selectedLoc.pricePerHour, foodRes.data, storedFoods);

    } catch (error) {
      console.error(error);
      alert("Error loading booking data");
    }
  };

  const calculateTotal = (locPrice, foodsList, selected) => {
    let totalAmount = Number(locPrice);

    foodsList.forEach(food => {
      if (selected[food.foodId] > 0) {
        totalAmount += food.price * selected[food.foodId];
      }
    });

    setTotal(totalAmount);
  };

 
const confirmBooking = async () => {
  try {

    const isEligible = localStorage.getItem("isEligible");

    // 🚨 Block booking on frontend too
    if (isEligible !== "true") {
      alert("Booking not allowed for your location");
      return;
    }

    const bookingData = {
      userId: parseInt(userId),
      gameId: parseInt(gameId),
      locationId: parseInt(locationId),
      bookingDate: new Date().toISOString(), // correct format
      timeSlot: "Evening Slot",
      totalAmount: total,
      paymentStatus: "Pending"
    };

    console.log("Sending:", bookingData);

    const res = await API.post("/Bookings", bookingData);

    const bookingId = res.data.bookingId;

    // Save foods
    for (const foodId in selectedFoods) {
      if (selectedFoods[foodId] > 0) {
        await API.post("/BookingFoods", {
          bookingId: parseInt(bookingId),
          foodId: parseInt(foodId),
          quantity: selectedFoods[foodId]
        });
      }
    }

    localStorage.setItem("bookingId", bookingId);
    localStorage.setItem("totalAmount", total);

    navigate("/payment");

  } catch (error) {
    console.error(error.response?.data || error);
    alert(error.response?.data || "Booking failed");
  }
};



  return (
    <div className="booking-container">

      <h2 className="text-center mb-4">Booking Summary</h2>

      <div className="summary-card">

        <h4>Location: {location.locationName}</h4>
        <p>Price: ₹{location.pricePerHour}</p>

        <h5 className="mt-4">Selected Foods</h5>

        {foods.map(food =>
          selectedFoods[food.foodId] > 0 && (
            <p key={food.foodId}>
              {food.foodName} x {selectedFoods[food.foodId]}
            </p>
          )
        )}

        <h3 className="mt-4">Total: ₹{total}</h3>

        <button className="btn btn-success mt-3" onClick={confirmBooking}>
          Confirm Booking
        </button>

      </div>

    </div>
  );
}

export default Booking;
