import axios, { AxiosInstance } from "axios";
import { createContext, useContext } from "react";

const ApiContext = createContext<AxiosInstance | null>(null);

export function ApiProvider({
  children,
  apiUrl,
}: {
  children: React.ReactNode;
  apiUrl: string;
}) {
  const api = useProvideApi(apiUrl);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi(): AxiosInstance {
  const api = useContext(ApiContext);
  if (!api) throw new Error("Could not find API provider");

  return api;
}

function useProvideApi(apiUrl: string) {
  const client = axios.create({
    baseURL: apiUrl,
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
          localStorage.removeItem("token");
          localStorage.removeItem("refresh-token");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}
