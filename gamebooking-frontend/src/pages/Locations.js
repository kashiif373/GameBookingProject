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
    <div className="food-container">

      {/* Hero Section (Same as Foods) */}
      <div className="food-hero">
        <h1>Select Location</h1>
        <p>Choose your preferred gaming zone</p>
      </div>

      <div className="row mt-5">
        {locations.map((loc) => (
          <div key={loc.locationId} className="col-lg-4 col-md-6 mb-5">
            <div className="food-card">

              {/* Image Section */}
              <div className="food-image">
                <img
                  src="/images/location-placeholder.jpg"
                  alt={loc.locationName}
                />
              </div>

              {/* Details Section */}
              <div className="food-details">
                <h5>{loc.locationName}</h5>
                <p><strong>City:</strong> {loc.city}</p>
                <p className="price">₹ {loc.pricePerHour} / hour</p>

                <button
                  className="order-btn"
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
  );
}

export default Locations;
