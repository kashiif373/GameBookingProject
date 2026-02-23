import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5203/api"
});

// ================= JWT INTERCEPTOR =================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ================= LOGOUT =================
export const logout = async () => {
  try {
    await API.post("/Users/logout");
  } catch (error) {
    console.log("Logout API failed");
  } finally {
    localStorage.clear();
  }
};

// ================= AUTH CHECK =================
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// ================= ⭐ IMPORTANT — GET USER INFO FROM JWT =================
export const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      userId: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    };
  } catch {
    return null;
  }
};

export default API;