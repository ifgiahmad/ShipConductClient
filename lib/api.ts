import axios from "axios";
import { getToken } from "../services/auth";
import { Token } from "@/lib/type";

// Membuat instance Axios dengan baseURL yang diambil dari environment variable
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor untuk menyisipkan token JWT pada setiap request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    const expirationDate = new Date(token.expiration);
    if (expirationDate > new Date()) {
      config.headers.Authorization = `Bearer ${token.token}`;
    } else {
      console.warn("Token has expired.");
    }
  }
  return config;
});

export default api;
