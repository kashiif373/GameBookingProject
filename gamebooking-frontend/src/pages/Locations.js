import React, { useEffect, useState } from "react";
import API, { isAuthenticated, getUserInfo } from "../services/api";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    window.scrollTo(0, 0);
    checkAuth();
    fetchLocations();
  }, []);

  const checkAuth = () => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) setUser(getUserInfo());
  };

  const fetchLocations = async () => {
    if (!gameId) {
      alert("Please select a game first");
      navigate("/dashboard");
      return;
    }

    try {
      const res = await API.get(`/Locations/${gameId}`);
      setLocations(res.data);
    } catch {
      alert("Failed to load locations");
    }
  };

  const selectLocation = (id) => {
    localStorage.setItem("locationId", id);
    navigate("/foods");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // ⭐ FIXED IMAGE LOGIC
  const getLocationImage = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes("patna cricket")) return patnacricketground;
    if (lower.includes("aligarh cricket")) return aligarhcricketstadium;
    if (lower.includes("patna football")) return patnafootballturf;
    if (lower.includes("aligarh football")) return aligarhfootballarena;

    if (lower.includes("patna") && lower.includes("tt"))
      return patnattclub;

    if (lower.includes("aligarh") && lower.includes("tt"))
      return aligarhttcenter;

    return patnacricketground; // fallback
  };

  return (
    <div className="locations-page">
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

      {/* CONTENT */}
      <div className="locations-content">
        <div className="hero-section">
          <h1>Select Location</h1>
          <p>Choose your preferred gaming zone</p>
        </div>

        <div className="row g-4">
          {locations.map((loc) => (
            <div key={loc.locationId} className="col-xl-3 col-lg-4 col-md-6">
              <div className="food-card">
                <div className="location-image">
                  <img
                    src={getLocationImage(loc.locationName)}
                    alt={loc.locationName}
                    onError={(e) =>
                      (e.target.src = patnacricketground)
                    }
                  />
                </div>

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

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 GameZone Booking System</p>
        <p>All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Locations;
