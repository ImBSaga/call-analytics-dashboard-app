import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  // Default to JSON unless caller overrides
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});
