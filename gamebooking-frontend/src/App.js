import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import Foods from "./pages/Foods";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import Payment from "./pages/Payment";
import Register from "./pages/Register";
import Login from "./pages/Login";

/* ⭐ NEW IMPORTS FOR OTP PAGES */
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminRoute from "./components/AdminRoute";

/* ===== ADMIN IMPORTS ===== */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageGames from "./pages/admin/ManageGames";
import ManageLocations from "./pages/admin/ManageLocations";
import ManageFoods from "./pages/admin/ManageFoods";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBookings from "./pages/admin/ManageBookings";

function App() {
  return (
    <Router>
      <Routes>

        {/* ===== HOME ===== */}
        <Route path="/" element={<Home />} />

        {/* ===== AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ⭐ NEW OTP ROUTES */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===== USER APP ===== */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/payment" element={<Payment />} />

        {/* ===== ADMIN PANEL ===== */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/games" element={<ManageGames />} />
        <Route path="/admin/locations" element={<ManageLocations />} />
        <Route path="/admin/foods" element={<ManageFoods />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />

      </Routes>
    </Router>
  );
}

export default App;