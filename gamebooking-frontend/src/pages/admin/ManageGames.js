import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import "./Admin.css";

function ManageGames() {
  const [games, setGames] = useState([]);
  const [gameName, setGameName] = useState("");
  const [editId, setEditId] = useState(null);

  // Load games
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const res = await API.get("/admin/games");
    setGames(res.data);
  };

  // Add new game
  const addGame = async () => {
    if (!gameName) return alert("Enter game name");

    await API.post("/admin/games", { gameName });
    setGameName("");
    fetchGames();
  };

  // Delete game
  const deleteGame = async (id) => {
    if (window.confirm("Delete this game?")) {
      await API.delete(`/admin/games/${id}`);
      fetchGames();
    }
  };

  // Start editing
  const startEdit = (game) => {
    setGameName(game.gameName);
    setEditId(game.gameId);
  };

  // Update game
  const updateGame = async () => {
    await API.put(`/admin/games/${editId}`, { gameName });
    setGameName("");
    setEditId(null);
    fetchGames();
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-content">
        <h2>Manage Games</h2>

        {/* Add / Edit Form */}
        <div className="admin-form">
          <input
            type="text"
            placeholder="Enter Game Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />

          {editId ? (
            <button onClick={updateGame}>Update Game</button>
          ) : (
            <button onClick={addGame}>Add Game</button>
          )}
        </div>

        {/* Games Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Game Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {games.map((g) => (
              <tr key={g.gameId}>
                <td>{g.gameId}</td>
                <td>{g.gameName}</td>
                <td>
                  <button onClick={() => startEdit(g)}>Edit</button>
                  <button onClick={() => deleteGame(g.gameId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageGames;