import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import "./Admin.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Load users
  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  // Delete user
  const deleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-content">
        <h2>Manage Users</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.userId}>
                <td>{u.userId}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={u.role === "Admin" ? "admin-role" : "user-role"}>
                    {u.role}
                  </span>
                </td>
                <td>{u.selectedCity}</td>
                <td>
                  {u.role !== "Admin" && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(u.userId)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default ManageUsers;