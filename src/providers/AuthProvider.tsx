"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/lib/api/axiosInstance";
import type { AuthContextValue, AuthUser } from "@/types/Auth.type";

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "cdr_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      api.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
      // Verify token is still valid by fetching /me
      api
        .get<{ success: boolean; user: AuthUser }>("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          delete api.defaults.headers.common["Authorization"];
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: AuthUser }>(
      "/auth/login",
      {
        email,
        password,
      },
    );
    const { token: jwt, user: me } = res.data;
    localStorage.setItem(TOKEN_KEY, jwt);
    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    setToken(jwt);
    setUser(me);
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      const res = await api.post<{ token: string; user: AuthUser }>(
        "/auth/signup",
        {
          email,
          password,
          name,
        },
      );
      const { token: jwt, user: me } = res.data;
      localStorage.setItem(TOKEN_KEY, jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      setToken(jwt);
      setUser(me);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
