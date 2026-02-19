import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "http://localhost:5203/api"
});

// ⭐ JWT INTERCEPTOR — SEND TOKEN IN EVERY REQUEST
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// ⭐ RESPONSE INTERCEPTOR — HANDLE JWT ERRORS
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ⭐ LOGOUT FUNCTION
export const logout = async () => {
  try {
    // Call logout endpoint (optional, for logging purposes)
    await API.post("/Users/logout");
  } catch (error) {
    // Even if the server call fails, we still want to clear local storage
    console.log("Logout API call failed, but clearing local storage");
  } finally {
    // Always clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("gameId");
  }
};

// ⭐ CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists
};

// ⭐ GET USER INFO FROM LOCALSTORAGE
export const getUserInfo = () => {
  return {
    name: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
    userId: localStorage.getItem("userId")
  };
};

export default API;
