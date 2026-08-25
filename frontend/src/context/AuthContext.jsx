import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, [token]);

  async function verifyToken() {
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setAdmin(data);
    } catch (err) {
      setToken(null);
      setAdmin(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  function login(newToken, adminEmail) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setAdmin({ email: adminEmail });
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setAdmin(null);
  }

  const value = {
    token,
    admin,
    isAuthenticated: !!admin,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}