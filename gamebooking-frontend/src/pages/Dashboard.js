import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

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

  return (
    <div className="food-container">

      {/* Hero Section (Same Style) */}
      <div className="food-hero">
        <h1>Select Your Game</h1>
        <p>Choose your favorite game and start booking</p>
      </div>

      <div className="row mt-5">
        {games.map((game) => (
          <div key={game.gameId} className="col-lg-4 col-md-6 mb-5">
            <div className="food-card">

              {/* Image Section (Manual Image Add Here) */}
              <div className="food-image">
                <img
                  src="/images/game-placeholder.jpg"
                  alt={game.gameName}
                />
              </div>

              {/* Game Details */}
              <div className="food-details">
                <h5>{game.gameName}</h5>

                <button
                  className="order-btn"
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
  );
}

export default Dashboard;
