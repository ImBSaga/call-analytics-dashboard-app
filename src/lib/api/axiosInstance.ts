import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach Content-Type default
api.interceptors.request.use((config) => {
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  // Inject stored JWT if axios default header hasn't been set yet
  // (this handles SSR/hydration edge cases)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cdr_auth_token")
      : null;
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear stored token (handle in UI via query error)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cdr_auth_token");
      }
    }
    return Promise.reject(error);
  },
);
