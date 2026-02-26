// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "./Register.css";
// import { isAuthenticated, getUserInfo } from "../services/api";

// function Register() {

//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const auth = isAuthenticated();
//     setAuthenticated(auth);
//     if (auth) {
//       setUser(getUserInfo());
//     }
//   }, []);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     selectedCity: "",
//     detectedCity: "",
//     isGpsEnabled: false
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [validationErrors, setValidationErrors] = useState({});

//   // ================= INPUT CHANGE =================
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value
//     });

//     if (validationErrors[name]) {
//       setValidationErrors({
//         ...validationErrors,
//         [name]: ""
//       });
//     }
//   };

//   // ================= FORM VALIDATION =================
//   const validateForm = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = "Name is required";
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!emailRegex.test(formData.email)) {
//       errors.email = "Invalid email format";
//     }

//     const phoneRegex = /^\d{10}$/;
//     if (!formData.phone.trim()) {
//       errors.phone = "Phone is required";
//     } else if (!phoneRegex.test(formData.phone)) {
//       errors.phone = "Phone must be 10 digits";
//     }

//     if (!formData.password) {
//       errors.password = "Password required";
//     } else if (formData.password.length < 6) {
//       errors.password = "Minimum 6 characters required";
//     }

//     if (!formData.selectedCity) {
//       errors.selectedCity = "Select city";
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // ================= REGISTER SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!validateForm()) return;

//     try {
//       // ⭐ IMPORTANT: Send correct payload matching backend model
//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         selectedCity: formData.selectedCity,
//         detectedCity: formData.detectedCity,
//         isGpsEnabled: formData.isGpsEnabled
//       };

//       const response = await API.post("/Users/register", payload);

//       setMessage("Registration successful! Welcome email sent 🎉");

//       // Clear form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         password: "",
//         selectedCity: "",
//         detectedCity: "",
//         isGpsEnabled: false
//       });

//       // Redirect to login after 2 seconds
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);

//     } catch (err) {
//       const status = err.response?.status;
//       const serverMessage = err.response?.data?.message;

//       if (status === 409) {
//         setError(serverMessage || "Email already exists");
//       } else if (status === 400) {
//         setError(serverMessage || "Invalid data");
//       } else {
//         setError("Something went wrong. Try again.");
//       }
//     }
//   };

//   const goToLogin = () => navigate("/login");

//   return (
//     <div className="register-page">
//       <div className="register-wrapper">

//         <div className="register-left">
//           <h1 className="brand-title">Join Us Today 🚀</h1>
//           <p className="brand-subtitle">
//             Create your account and start playing instantly.
//           </p>
//         </div>

//         <div className="register-right">
//           <div className="register-card">

//             <h3 className="register-title">Create Account</h3>

//             {message && <div className="alert success">{message}</div>}
//             {error && <div className="alert error">{error}</div>}

//             <form onSubmit={handleSubmit}>

//               <input className="custom-input" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
//               {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}

//               <input className="custom-input" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
//               {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}

//               <input className="custom-input" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
//               {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}

//               <input className="custom-input" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
//               {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}

//               <select className="custom-input" name="selectedCity" value={formData.selectedCity} onChange={handleChange}>
//                 <option value="">Select City</option>
//                 <option value="Patna">Patna</option>
//                 <option value="Aligarh">Aligarh</option>
//                 <option value="Other">Other</option>
//               </select>
//               {validationErrors.selectedCity && <span className="error-text">{validationErrors.selectedCity}</span>}

//               <div className="checkbox-wrapper">
//                 <input type="checkbox" name="isGpsEnabled" checked={formData.isGpsEnabled} onChange={handleChange} />
//                 <label>Use My Current Location</label>
//               </div>

//               <button type="submit" className="register-btn">
//                 Register Now
//               </button>

//               <button type="button" className="back-btn" onClick={goToLogin}>
//                 ← Back to Login
//               </button>

//             </form>
//           </div>
//         </div>
//       </div>

//       <footer className="footer">
//         <p>© 2026 Playeato Booking System</p>
//       </footer>
//     </div>
//   );
// }

// export default Register;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";
import { isAuthenticated, getUserInfo } from "../services/api";
 
function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUser(getUserInfo());
    }
  }, []);
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    selectedCity: "",
    detectedCity: "",
    isGpsEnabled: false
  });
 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
 
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
 
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ""
      });
    }
  };
 
  const validateForm = () => {
    const errors = {};
 
    // Name 2–25
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (
      formData.name.trim().length < 2 ||
      formData.name.trim().length > 25
    ) {
      errors.name = "Name must be between 2 and 25 characters";
    }
 
    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }
 
    // Phone
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }
 
    // Password 6–15
    if (!formData.password) {
      errors.password = "Password required";
    } else if (
      formData.password.length < 6 ||
      formData.password.length > 15
    ) {
      errors.password = "Password must be between 6 and 15 characters";
    }
 
    if (!formData.selectedCity) {
      errors.selectedCity = "Select city";
    }
 
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
 
    if (!validateForm()) return;
 
    try {
      setLoading(true);
 
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        selectedCity: formData.selectedCity,
        detectedCity: formData.detectedCity,
        isGpsEnabled: formData.isGpsEnabled
      };
 
      await API.post("/Users/register", payload);
 
      setMessage("Registration successful! 🎉");
 
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        selectedCity: "",
        detectedCity: "",
        isGpsEnabled: false
      });
 
      setTimeout(() => {
        navigate("/login");
      }, 2000);
 
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
 
      if (status === 409) {
        setError(serverMessage || "Email already exists");
      } else if (status === 400) {
        setError(serverMessage || "Invalid data");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };
 
  const goToLogin = () => navigate("/login");
 
  return (
    <div className="register-page">
      <div className="register-wrapper">
 
        <div className="register-left">
          <h1 className="brand-title">Join Us Today 🚀</h1>
          <p className="brand-subtitle">
            Create your account and start playing instantly.
          </p>
        </div>
 
        <div className="register-right">
          <div className="register-card">
            <h3 className="register-title">Create Account</h3>
 
            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert error">{error}</div>}
 
            <form onSubmit={handleSubmit}>
 
              <input
                className="custom-input"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                maxLength={25}
               
              />
              {validationErrors.name && (
                <span className="error-text">{validationErrors.name}</span>
              )}
 
              <input
                className="custom-input"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {validationErrors.email && (
                <span className="error-text">{validationErrors.email}</span>
              )}
 
              <input
                className="custom-input"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
              />
              {validationErrors.phone && (
                <span className="error-text">{validationErrors.phone}</span>
              )}
 
              {/* PASSWORD FIELD WITH SINGLE 👁 */}
              <div className="password-wrapper">
                <input
                  className="custom-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                maxLength={15}
                 
                  autoComplete="new-password"
                />
 
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  👁
                </span>
              </div>
 
              {validationErrors.password && (
                <span className="error-text">{validationErrors.password}</span>
              )}
 
              <select
                className="custom-input"
                name="selectedCity"
                value={formData.selectedCity}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                <option value="Patna">Patna</option>
                <option value="Aligarh">Aligarh</option>
                <option value="Other">Other</option>
              </select>
 
              {validationErrors.selectedCity && (
                <span className="error-text">{validationErrors.selectedCity}</span>
              )}
 
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="isGpsEnabled"
                  checked={formData.isGpsEnabled}
                  onChange={handleChange}
                />
                <label>Use My Current Location</label>
              </div>
 
              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Now"}
              </button>
 
              <button
                type="button"
                className="back-btn"
                onClick={goToLogin}
              >
                ← Back to Login
              </button>
 
            </form>
          </div>
        </div>
      </div>
 
      <footer className="footer">
        <p>© 2026 Playeato Booking System</p>
      </footer>
    </div>
  );
}
 
export default Register;