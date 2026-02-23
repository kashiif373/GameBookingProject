import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import "./Admin.css";

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    locationName: "",
    city: "",
    pricePerHour: "",
    gameId: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const res = await API.get("/admin/locations");
    setLocations(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addLocation = async () => {
    await API.post("/admin/locations", form);
    setForm({ locationName: "", city: "", pricePerHour: "", gameId: "" });
    fetchLocations();
  };

  const startEdit = (loc) => {
    setEditId(loc.locationId);
    setForm(loc);
  };

  const updateLocation = async () => {
    await API.put(`/admin/locations/${editId}`, form);
    setEditId(null);
    setForm({ locationName: "", city: "", pricePerHour: "", gameId: "" });
    fetchLocations();
  };

  const deleteLocation = async (id) => {
    if (window.confirm("Delete location?")) {
      await API.delete(`/admin/locations/${id}`);
      fetchLocations();
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-content">
        <h2>Manage Locations</h2>

        <div className="admin-form">
          <input name="locationName" placeholder="Name" value={form.locationName} onChange={handleChange} />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <input name="pricePerHour" placeholder="Price" value={form.pricePerHour} onChange={handleChange} />
          <input name="gameId" placeholder="GameId" value={form.gameId} onChange={handleChange} />

          {editId ? (
            <button onClick={updateLocation}>Update</button>
          ) : (
            <button onClick={addLocation}>Add</button>
          )}
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>Price</th>
              <th>Game</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((l) => (
              <tr key={l.locationId}>
                <td>{l.locationId}</td>
                <td>{l.locationName}</td>
                <td>{l.city}</td>
                <td>{l.pricePerHour}</td>
                <td>{l.gameId}</td>
                <td>
                  <button onClick={() => startEdit(l)}>Edit</button>
                  <button onClick={() => deleteLocation(l.locationId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageLocations;