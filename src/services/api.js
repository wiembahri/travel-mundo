import axios from "axios";

// L'URL de votre backend — mettez la vraie URL dans .env
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("tm_user") || "{}");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
