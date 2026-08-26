import axios from "axios";

const configuredBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const apiBaseUrl = configuredBaseUrl.endsWith("/api")
  ? configuredBaseUrl
  : `${configuredBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
