// lib/axios.js
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // Adjust to your backend URL
  withCredentials: true, // send cookies (needed for auth/session)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor for automatic error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
