import React, { useEffect, useState } from "react";
import API from "../services/api";
import { logout, isAuthenticated, getUserInfo } from "../services/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

import cricket from "../images/cricket.jpg";
import football from "../images/football.jpg";
import tabletennis from "../images/tabletennis.jpg";
import badminton from "../images/badminton.jpg";

function Dashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication and get user info
    const checkAuth = () => {
      const auth = isAuthenticated();
      if (!auth) {
        // Not logged in, redirect to login
        navigate("/login");
      } else {
        setUser(getUserInfo());
      }
    };
    
    fetchGames();
    checkAuth();
  }, [navigate]);

  const fetchGames = async () => {
    try {
      const res = await API.get("/Games");
      setGames(res.data);
    } catch {
      alert("Failed to load games");
    }
  };

  const selectGame = (gameId) => {
    localStorage.setItem("gameId", gameId);
    navigate("/locations");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ⭐ Image Mapping Function
  const getGameImage = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes("cricket")) return cricket;
    if (lower.includes("football")) return football;
    if (lower.includes("table")) return tabletennis;
    if (lower.includes("badminton")) return badminton;

    return "https://via.placeholder.com/400x300";
  };

  return (
    <div className="food-page">

      <div className="container">

        {/* USER INFO BAR */}
        {user && (
          <div className="user-info-bar">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}

        {/* HERO */}
        <div className="hero-section">
          <h1>Select Your Game</h1>
          <p>Choose your favorite game and start booking</p>
        </div>

        {/* GRID */}
        <div className="row g-4">
          {games.map((game) => (
            <div key={game.gameId} className="col-xl-3 col-lg-4 col-md-6">
              <div className="food-card">

                {/* IMAGE */}
                <div className="food-image">
                  <img
                    src={getGameImage(game.gameName)}
                    alt={game.gameName}
                  />
                </div>

                {/* DETAILS */}
                <div className="food-details">
                  <h5>{game.gameName}</h5>

                  <button
                    className="premium-btn mt-3"
                    onClick={() => selectGame(game.gameId)}
                  >
                    Book Now →
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
