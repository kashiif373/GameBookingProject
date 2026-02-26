import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>

      <button onClick={() => navigate("/admin")}>Dashboard</button>
      <button onClick={() => navigate("/admin/games")}>Games</button>
      <button onClick={() => navigate("/admin/locations")}>Locations</button>
      <button onClick={() => navigate("/admin/foods")}>Foods</button>
      <button onClick={() => navigate("/admin/users")}>Users</button>
      <button onClick={() => navigate("/admin/bookings")}>Bookings</button>
    </div>
  );
}

export default AdminSidebar;
