import React, { useEffect, useState } from "react";
import API, { isAuthenticated, getUserInfo } from "../services/api";
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Load saved foods from localStorage on component mount
  useEffect(() => {
    const savedFoods = localStorage.getItem("selectedFoods");
    if (savedFoods) {
      setSelectedFoods(JSON.parse(savedFoods));
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFoods();
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) setUser(getUserInfo());
  };

  const fetchFoods = async () => {
    try {
      const res = await API.get("/Foods");
      setFoods(res.data);
    } catch {
      alert("Failed to load foods");
    }
  };

  // ⭐ UPDATED QUANTITY FUNCTION (MAX 10 LIMIT)
  const updateQuantity = (foodId, change) => {
    setSelectedFoods((prev) => {
      const currentQty = prev[foodId] || 0;
      const newQty = currentQty + change;

      if (newQty > 10) {
        alert("Maximum 10 quantities allowed per item");
        return prev;
      }

      if (newQty < 0) {
        return prev;
      }

      return { ...prev, [foodId]: newQty };
    });
  };

  const proceedBooking = () => {
    localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
    navigate("/booking");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
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

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/")}>Playeato</div>

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <button onClick={() => handleNavClick("/")}>Home</button>
          <button onClick={() => handleNavClick("/dashboard")}>Games</button>
          <button onClick={() => handleNavClick("/history")}>My Bookings</button>

          {authenticated && user ? (
            <span className="user-welcome">Hello, {user.name}!</span>
          ) : (
            <button onClick={() => handleNavClick("/login")}>Login</button>
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
          {foods.map((food) => {
            const qty = selectedFoods[food.foodId] || 0;

            return (
              <div key={food.foodId} className="col-lg-4 col-md-6">
                <div className="food-card">

                  <div className="food-image">
                    <img src={getFoodImage(food.foodName)} alt="" />
                  </div>

                  <div className="food-details">
                    <h5>{food.foodName}</h5>
                    <p className="price">₹ {food.price}</p>

                    <div className="quantity-control">
                      <button
                        disabled={qty === 0}
                        onClick={() => updateQuantity(food.foodId, -1)}
                      >
                        −
                      </button>

                      <span>{qty}</span>

                      <button
                        disabled={qty >= 10}
                        onClick={() => updateQuantity(food.foodId, 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* LIMIT MESSAGE */}
                    {qty >= 10 && (
                      <small style={{ color: "#ff6b6b" }}>
                        Max limit reached
                      </small>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* PROCEED BUTTON */}
        <div className="text-center mt-5">
          <button className="premium-btn" onClick={proceedBooking}>
            Proceed to Booking →
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 GameZone Booking System</p>
        <p>All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Foods;
