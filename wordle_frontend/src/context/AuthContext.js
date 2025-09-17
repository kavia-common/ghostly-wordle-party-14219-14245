import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, userApi } from "../services/api";

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load current user on mount
  useEffect(() => {
    let mounted = true;
    userApi
      .me()
      .then((data) => {
        if (!mounted) return;
        setUser({ id: data?.id, username: data?.username, email: data?.email });
        setProfile(data);
      })
      .catch(() => {
        // not logged in or error
      })
      .finally(() => setInitializing(false));
    return () => {
      mounted = false;
    };
  }, []);

  // PUBLIC_INTERFACE
  async function login(username, password) {
    const u = await authApi.login(username, password);
    setUser(u);
    const me = await userApi.me().catch(() => null);
    if (me) setProfile(me);
    return u;
  }

  // PUBLIC_INTERFACE
  async function register({ username, email, password }) {
    const u = await authApi.register({ username, email, password });
    setUser(u);
    const me = await userApi.me().catch(() => null);
    if (me) setProfile(me);
    return u;
  }

  // PUBLIC_INTERFACE
  async function logout() {
    await authApi.logout().catch(() => {});
    setUser(null);
    setProfile(null);
  }

  // PUBLIC_INTERFACE
  async function requestPasswordReset(email) {
    return authApi.requestPasswordReset(email);
  }

  // PUBLIC_INTERFACE
  async function confirmPasswordReset({ uid, token, new_password }) {
    return authApi.confirmPasswordReset({ uid, token, new_password });
  }

  const value = {
    user,
    profile,
    initializing,
    login,
    register,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    setProfile, // expose for updates
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
