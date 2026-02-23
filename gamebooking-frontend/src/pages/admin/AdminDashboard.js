import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import "./Admin.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await API.get("/admin/stats");

    setStats(res.data);

    const months = res.data.monthlyRevenue.map(m => `Month ${m.month}`);
    const revenue = res.data.monthlyRevenue.map(m => m.revenue);

    setChartData({
      labels: months,
      datasets: [
        {
          label: "Monthly Revenue",
          data: revenue,
          backgroundColor: "#4CAF50"
        }
      ]
    });
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-content">
        <h2>Admin Dashboard</h2>

        {/* STAT CARDS */}
        <div className="admin-cards">
          <div className="admin-card">
            <h3>Users</h3>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="admin-card">
            <h3>Bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>

          <div className="admin-card">
            <h3>Revenue</h3>
            <p>₹ {stats.totalRevenue}</p>
          </div>
        </div>

        {/* CHART */}
        <div style={{ marginTop: "40px", background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
          <h3 style={{ marginBottom: "20px" }}>Revenue Analytics</h3>

          {chartData.labels && (
            <Bar data={chartData} />
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;