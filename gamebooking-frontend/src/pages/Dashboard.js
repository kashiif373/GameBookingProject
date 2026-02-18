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
    <div className="dashboard-container">

      <h2 className="text-center mb-4">Select a Game</h2>

      <div className="row">
        {games.map((game) => (
          <div key={game.gameId} className="col-md-4 mb-4">
            <div className="game-card">

              <h4>{game.gameName}</h4>

              <button
                className="btn btn-primary game-btn"
                onClick={() => selectGame(game.gameId)}
              >
                Book Now
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
