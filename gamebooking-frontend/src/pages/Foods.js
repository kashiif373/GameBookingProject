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
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/Foods");
      setFoods(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load foods");
    }
  };

  const updateQuantity = (foodId, change) => {
    setSelectedFoods((prev) => {
      const newQty = (prev[foodId] || 0) + change;
      return {
        ...prev,
        [foodId]: newQty < 0 ? 0 : newQty
      };
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

  // 🔥 Image Mapping Object (Clean & Scalable)
  const foodImages = {
    biryani,
    dosa,
    pizza,
    coffee,
    burger
  };

  const getFoodImage = (name) => {
    const lowerName = name.toLowerCase();

    for (let key in foodImages) {
      if (lowerName.includes(key)) {
        return foodImages[key];
      }
    }

    return "/images/placeholder.jpg"; // fallback image
  };

  return (
    <div className="food-container">

      {/* Hero Section */}
      <div className="food-hero">
        <h1>Delicious Add-Ons</h1>
        <p>Enhance your booking with tasty food & beverages</p>
      </div>

      {/* Food Cards */}
      <div className="row mt-5">
        {foods.map((food) => (
          <div key={food.foodId} className="col-lg-4 col-md-6 mb-5">
            <div className="food-card">

              {/* Image */}
              <div className="food-image">
                <img
                  src={getFoodImage(food.foodName)}
                  alt={food.foodName}
                  className="img-fluid"
                />
              </div>

              {/* Details */}
              <div className="food-details">
                <h5>{food.foodName}</h5>
                <p className="price">₹ {food.price}</p>

                <div className="quantity-control">
                  <button onClick={() => updateQuantity(food.foodId, -1)}>
                    -
                  </button>

                  <span>{selectedFoods[food.foodId] || 0}</span>

                  <button onClick={() => updateQuantity(food.foodId, 1)}>
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Proceed Button */}
      <div className="text-center mt-4">
        <button className="premium-btn" onClick={proceedBooking}>
          Proceed to Booking →
        </button>
      </div>

    </div>
  );
}

export default Foods;
