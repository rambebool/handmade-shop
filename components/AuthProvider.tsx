"use client";

import { createContext, useContext, useSyncExternalStore, useCallback, ReactNode } from "react";
import { User } from "@/lib/types";
import { getCurrentUser, logout as doLogout } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  refresh: () => {},
  logout: () => {},
});

let authVersion = 0;
const authListeners = new Set<() => void>();

function notifyAuth() {
  authVersion++;
  authListeners.forEach((cb) => cb());
}

function subscribeAuth(cb: () => void) {
  authListeners.add(cb);
  const onEvent = () => { notifyAuth(); };
  window.addEventListener("auth-update", onEvent);
  window.addEventListener("storage", onEvent);
  return () => {
    authListeners.delete(cb);
    window.removeEventListener("auth-update", onEvent);
    window.removeEventListener("storage", onEvent);
  };
}

let cachedUser: User | null = null;
let cachedUserVersion = -1;

function getAuthSnapshot(): User | null {
  if (cachedUserVersion !== authVersion) {
    cachedUserVersion = authVersion;
    cachedUser = getCurrentUser();
  }
  return cachedUser;
}

function getServerAuthSnapshot(): null {
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);

  const refresh = useCallback(() => {
    notifyAuth();
  }, []);

  const logout = useCallback(() => {
    doLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: false, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
