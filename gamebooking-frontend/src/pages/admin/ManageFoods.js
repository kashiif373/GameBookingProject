import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import "./Admin.css";

function ManageFoods() {
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  // Load foods
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    const res = await API.get("/Foods");
    setFoods(res.data);
  };

  // Add new food
  const addFood = async () => {
    if (!foodName || !price) return alert("Enter food name and price");

    await API.post("/Foods", { 
      foodName, 
      price: parseFloat(price) 
    });
    setFoodName("");
    setPrice("");
    fetchFoods();
  };

  // Delete food
  const deleteFood = async (id) => {
    if (window.confirm("Delete this food?")) {
      await API.delete(`/Foods/${id}`);
      fetchFoods();
    }
  };

  // Start editing
  const startEdit = (food) => {
    setFoodName(food.foodName);
    setPrice(food.price.toString());
    setEditId(food.foodId);
  };

  // Update food
  const updateFood = async () => {
    await API.put(`/Foods/${editId}`, { 
      foodName, 
      price: parseFloat(price) 
    });
    setFoodName("");
    setPrice("");
    setEditId(null);
    fetchFoods();
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-content">
        <h2>Manage Foods</h2>

        {/* Add / Edit Form */}
        <div className="admin-form">
          <input
            type="text"
            placeholder="Enter Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {editId ? (
            <button onClick={updateFood}>Update Food</button>
          ) : (
            <button onClick={addFood}>Add Food</button>
          )}
        </div>

        {/* Foods Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Food Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {foods.map((f) => (
              <tr key={f.foodId}>
                <td>{f.foodId}</td>
                <td>{f.foodName}</td>
                <td>₹{f.price}</td>
                <td>
                  <button onClick={() => startEdit(f)}>Edit</button>
                  <button onClick={() => deleteFood(f.foodId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageFoods;
