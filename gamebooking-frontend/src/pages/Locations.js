import React, { useEffect, useState } from "react";
import API from "../services/api";
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

  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    window.scrollTo(0, 0);
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

  // ⭐ Image Mapping Function
  const getLocationImage = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes("patna cricket")) return patnacricketground;
    if (lower.includes("aligarh cricket")) return aligarhcricketstadium;
    if (lower.includes("patna football")) return patnafootballturf;
    if (lower.includes("aligarh football")) return aligarhfootballarena;
    if (lower.includes("tt") || lower.includes("table")) return patnattclub;
    if (lower.includes("aligarh tt")) return aligarhttcenter;

    return "https://via.placeholder.com/400x300";
  };

  return (
    <div className="food-page">

      <div className="container">

        {/* HERO */}
        <div className="hero-section">
          <h1>Select Location</h1>
          <p>Choose your preferred gaming zone</p>
        </div>

        {/* GRID */}
        <div className="row g-4">
          {locations.map((loc) => (
            <div key={loc.locationId} className="col-xl-3 col-lg-4 col-md-6">
              <div className="food-card">

                {/* IMAGE */}
                <div className="food-image">
                  <img
                    src={getLocationImage(loc.locationName)}
                    alt={loc.locationName}
                  />
                </div>

                {/* DETAILS */}
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
    </div>
  );
}

export default Locations;
