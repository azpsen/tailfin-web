import { client } from "./api";
import { useNavigate } from "@remix-run/react";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValues {
  user: string | null;
  loading: boolean;
  signin: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  signout: () => void;
}

const AuthContext = createContext<AuthContextValues | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValues {
  const data = useContext(AuthContext);
  if (!data) {
    throw new Error("Could not find AuthContext provider");
  }
  return data;
}

function useProvideAuth() {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const handleUser = (rawUser: string | null) => {
    if (rawUser) {
      setUser(rawUser);
      setLoading(false);
      return rawUser;
    } else {
      setUser(null);
      clearTokens();
      setLoading(false);
      return false;
    }
  };

  const handleTokens = (tokens: {
    access_token: string;
    refresh_token: string;
  }) => {
    if (tokens) {
      localStorage.setItem("token", tokens.access_token);
      localStorage.setItem("refresh-token", tokens.refresh_token);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh-token");
  };

  const signin = async (values: { username: string; password: string }) => {
    setLoading(true);
    await client
      .postForm("/auth/login", values)
      .then((response) => handleTokens(response.data))
      .catch(() => {
        setLoading(false);
        throw new Error("Invalid username or password");
      });

    setLoading(false);
    await client
      .get("/users/me")
      .then((response) => handleUser(response.data.username))
      .catch(() => handleUser(null));
    navigate("/logbook");
  };

  const signout = async () => {
    return await client.post("/auth/logout").then(() => handleUser(null));
  };

  useEffect(() => {
    client
      .get("/users/me")
      .then((response) => handleUser(response.data.username))
      .catch(() => handleUser(null));
  }, []);

  return {
    user,
    loading,
    signin,
    signout,
  };
}
