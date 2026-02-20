import React, { useEffect, useState } from "react";
import API from "../services/api";
import { logout, isAuthenticated, getUserInfo } from "../services/api";
import "./Locations.css";
import { useNavigate } from "react-router-dom";

import patnacricketground from "../images/patnacricketground.jpg";
import aligarhcricketstadium from "../images/aligarhcricketstadium.jpg";
import patnafootballturf from "../images/patnafootballturf.jpg";
import aligarhfootballarena from "../images/aligarhfootballarena.jpeg";
import patnattclub from "../images/Patnattclub.jpg";
import aligarhttcenter from "../images/aligargttcenter.jpg";

function Locations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLocations();
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUser(getUserInfo());
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await API.get(`/Locations/${gameId}`);
      setLocations(res.data);
    } catch {
      alert("Failed to load locations");
    }
  };

  const selectLocation = (locationId) => {
    localStorage.setItem("locationId", locationId);
    navigate("/foods");
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  // Image Mapping Function
  const getLocationImage = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes("patna cricket")) return patnacricketground;
    if (lower.includes("aligarh cricket")) return aligarhcricketstadium;
    if (lower.includes("patna football")) return patnafootballturf;
    if (lower.includes("aligarh football")) return aligarhfootballarena;
    if (lower.includes("tt") || lower.includes("table")) return patnattclub;
    if (lower.includes("aligarh tt")) return aligarhttcenter;

    return "https://via.placeholder.com/400x300";
  };

  return (
    <div className="locations-page">

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

      <div className="locations-content">

        {/* HERO */}
        <div className="hero-section">
          <h1>Select Location</h1>
          <p>Choose your preferred gaming zone</p>
        </div>

        {/* GRID */}
        <div className="row g-4">
          {locations.map((loc) => (
            <div key={loc.locationId} className="col-xl-3 col-lg-4 col-md-6">
              <div className="food-card">

                {/* IMAGE */}
                <div className="food-image">
                  <img
                    src={getLocationImage(loc.locationName)}
                    alt={loc.locationName}
                  />
                </div>

                {/* DETAILS */}
                <div className="food-details">
                  <h5>{loc.locationName}</h5>
                  <p><strong>City:</strong> {loc.city}</p>
                  <p className="price">₹ {loc.pricePerHour} / hour</p>

                  <button
                    className="premium-btn mt-3"
                    onClick={() => selectLocation(loc.locationId)}
                  >
                    Select Location →
                  </button>
                </div>

              </div>
            </div>
          ))}
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

export default Locations;
