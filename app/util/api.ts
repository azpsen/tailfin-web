import axios from "axios";

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
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.request.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken) {
        try {
          const { data } = await client.post("/auth/refresh", {
            refresh: refreshToken,
          });
          localStorage.setItem("token", data.refreshToken);
          client.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.refreshToken}`;
          return client(originalRequest);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
