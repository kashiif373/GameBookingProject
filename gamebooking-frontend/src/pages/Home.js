import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="nav-logo">Playeato</div>

        <div className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/dashboard")}>Games</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-content">
          <h1>Book Your Game Instantly</h1>
          <p>
            Find nearby sports venues, select your favorite game,
            and book your slot in seconds.
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
          <p>Order snacks while booking your game.</p>
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
