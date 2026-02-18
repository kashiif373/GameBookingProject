import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import Foods from "./pages/Foods";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";





import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/locations" element={<Locations />} />
         <Route path="/foods" element={<Foods />} />
         <Route path="/booking" element={<Booking />} />
         <Route path="/payment" element={<Payment />} />





      </Routes>
    </Router>
  );
}

export default App;
