import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./Foods.css";
import { useNavigate } from "react-router-dom";

function Foods() {

  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/Foods");
      setFoods(res.data);
    } catch {
      alert("Failed to load foods");
    }
  };

  const handleQuantityChange = (foodId, quantity) => {
  setSelectedFoods({
    ...selectedFoods,
    [foodId]: Number(quantity)
  });
};


  const proceedBooking = () => {
    localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
    navigate("/booking");
  };

  return (
    <div className="food-container">

      <h2 className="text-center mb-4">Select Food</h2>

      <div className="row">
        {foods.map(food => (
          <div key={food.foodId} className="col-md-4 mb-4">

            <div className="food-card">
              <h5>{food.foodName}</h5>
              <p>Price: ₹{food.price}</p>

              <input
                type="number"
                min="0"
                placeholder="Qty"
                className="form-control food-input"
                onChange={(e) =>
                  handleQuantityChange(food.foodId, e.target.value)
                }
              />

            </div>

          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={proceedBooking}>
          Proceed to Booking
        </button>
      </div>

    </div>
  );
}

export default Foods;
