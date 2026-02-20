import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getUserInfo } from "../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) setUser(getUserInfo());
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <div className="home-page">

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="nav-logo">Playeato</div>

        <div className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/dashboard")}>Games</button>

          {/* ⭐ NEW BUTTON */}
          {authenticated && (
            <button onClick={() => navigate("/history")}>
              My Bookings
            </button>
          )}

          {authenticated && user ? (
            <>
              <span className="user-welcome">Hello, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-content">
          <h1>Book Your Game Instantly</h1>
          <p>
            Find nearby sports venues, select your favorite game,
            and book your slot in seconds. Experience seamless gaming 
            with food delivery right to your venue!
          </p>

          <button
            className="hero-btn"
            onClick={() => navigate("/dashboard")}
          >
            Explore Games →
          </button>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features">
        <div className="feature-card">
          <h3>⚡ Instant Booking</h3>
          <p>Book slots quickly without waiting in queues.</p>
        </div>

        <div className="feature-card">
          <h3>📍 Multiple Locations</h3>
          <p>Choose from many gaming zones near you.</p>
        </div>

        <div className="feature-card">
          <h3>🍔 Add Food Options</h3>
          <p>Order snacks and beverages while booking.</p>
        </div>

        <div className="feature-card">
          <h3>💳 Easy Payments</h3>
          <p>Pay online or at the venue easily.</p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Choose Game</h4>
            <p>Select your favorite sport.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h4>Pick Location</h4>
            <p>Find nearby venues.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h4>Add Food</h4>
            <p>Order snacks and drinks.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h4>Confirm & Play</h4>
            <p>Pay and enjoy your game.</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2026 GameZone Booking System</p>
        <p>All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
