import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
  withCredentials: true, // ✅ if you later use cookies
  headers: {
    "Content-Type": "application/json", // default content type
  },
});

// Add a request interceptor to include JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Token may be invalid or expired.");
      // You can auto-logout or redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api;
