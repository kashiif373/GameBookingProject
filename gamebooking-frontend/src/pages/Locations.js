import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./Locations.css";
import { useNavigate } from "react-router-dom";

function Locations() {

  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    fetchLocations();
  }, []);

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

  return (
    <div className="location-container">

      <h2 className="text-center mb-4">Select Location</h2>

      <div className="row">
        {locations.map(loc => (
          <div key={loc.locationId} className="col-md-4 mb-4">

            <div className="location-card">
              <h5>{loc.locationName}</h5>
              <p>City: {loc.city}</p>
              <p>Price: ₹{loc.pricePerHour}</p>

              <button
                className="btn btn-success location-btn"
                onClick={() => selectLocation(loc.locationId)}
              >
                Select
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Locations;
