// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import httpClient from "@/services/httpClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set base URL for your API
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  // Keep the backend base URL configurable per environment.

  // Check for token/user on mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        // Using our api client to validate the token
        const response = await httpClient.get('/auth/validate');
        
        if (response.isValid && response.user) {
          setUser(response.user);
          localStorage.setItem("user", JSON.stringify(response.user));
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  // Sign In
  const signIn = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Sign Out
  const signOut = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("Backend logout failed or not implemented:", err.message);
    }

    localStorage.removeItem("user");
    setUser(null);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};