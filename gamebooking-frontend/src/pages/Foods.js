import React, { useEffect, useState } from "react";
import API from "../services/api";
import { logout, isAuthenticated, getUserInfo } from "../services/api";
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
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFoods();
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUser(getUserInfo());
    }
  };

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
    // Save foods even if none selected
    localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
    navigate("/booking");
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
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
    <div className="foods-page">

      {/* ===== NAVBAR ===== */}
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

      <div className="foods-content">

        {/* HERO */}
        <div className="hero-section">
          <h1>Delicious Add-Ons</h1>
          <p>Enhance your booking with tasty food & beverages</p>
        </div>

        {/* FOOD CARDS */}
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

        {/* PROCEED BUTTON */}
        <div className="text-center mt-5">
          <button className="premium-btn" onClick={proceedBooking}>
            Proceed to Booking →
          </button>
        </div>

      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2026 GameZone Booking System</p>
        <p>All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Foods;
