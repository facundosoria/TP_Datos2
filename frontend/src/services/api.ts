import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

// Agrega el token JWT a todas las requests si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
