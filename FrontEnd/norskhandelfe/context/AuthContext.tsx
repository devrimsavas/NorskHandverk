"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthUser, clearAuth, loadAuth, saveAuth } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  login: (auth: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Read the stored login once, in the browser
  useEffect(() => {
    setUser(loadAuth());
    setIsReady(true);
  }, []);

  const login = (auth: AuthUser) => {
    saveAuth(auth);
    setUser(auth);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
