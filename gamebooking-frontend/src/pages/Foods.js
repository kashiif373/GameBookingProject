import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./Foods.css";
import { useNavigate } from "react-router-dom";

import biryani from "../images/Chicken-Biryani.jpg";
import dosa from "../images/dosa.jpg";
import pizza from "../images/pizza.jpg";
import coffee from "../images/coffee.jpg";
import burger from "../images/burger.jpg";

function Foods() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
useEffect(() => {
  window.scrollTo(0, 0);   // ⭐ THIS LINE FIXES EVERYTHING
  fetchFoods();
}, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/Foods");
      setFoods(res.data);
    } catch (error) {
      alert("Failed to load foods");
    }
  };

  const updateQuantity = (foodId, change) => {
    setSelectedFoods((prev) => {
      const newQty = (prev[foodId] || 0) + change;
      return { ...prev, [foodId]: newQty < 0 ? 0 : newQty };
    });
  };

  const proceedBooking = () => {
    const hasSelected = Object.values(selectedFoods).some(qty => qty > 0);

    if (!hasSelected) {
      alert("Please select at least one food item");
      return;
    }

    localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
    navigate("/booking");
  };

  const getFoodImage = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("biryani")) return biryani;
    if (lower.includes("dosa")) return dosa;
    if (lower.includes("pizza")) return pizza;
    if (lower.includes("coffee") || lower.includes("cofee")) return coffee;
    if (lower.includes("burger")) return burger;
    return "https://via.placeholder.com/400x300";
  };

  return (
    <div className="food-page">

      <div className="container">

        {/* HERO */}
        <div className="hero-section">
          <h1>Delicious Add-Ons</h1>
          <p>Enhance your booking with tasty food & beverages</p>
        </div>

        {/* CARDS GRID */}
        <div className="row gx-4 gy-4 mt-4">

          {foods.map((food) => (
            <div key={food.foodId} className="col-lg-4 col-md-6">
              <div className="food-card">

                <div className="food-image">
                  <img src={getFoodImage(food.foodName)} alt="" />
                </div>

                <div className="food-details">
                  <h5>{food.foodName}</h5>
                  <p className="price">₹ {food.price}</p>

                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(food.foodId, -1)}>−</button>
                    <span>{selectedFoods[food.foodId] || 0}</span>
                    <button onClick={() => updateQuantity(food.foodId, 1)}>+</button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="text-center mt-5">
          <button className="premium-btn" onClick={proceedBooking}>
            Proceed to Booking →
          </button>
        </div>

      </div>
    </div>
  );
}

export default Foods;
