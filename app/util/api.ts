import axios from "axios";
import { useAuth } from "./auth";

export const client = axios.create({
  baseURL: "http://localhost:8081",
  headers: { "Access-Control-Allow-Origin": "*" },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    const { clearUser } = useAuth();
    console.log(error.response);
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refresh-token");
        const response = await client.post("/auth/refresh", { refreshToken });
        const newAccessToken = response.data.access_token;

        localStorage.setItem("token", newAccessToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(error.config);
      } catch (err) {
        clearUser();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
