// src/context/UserProvider.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { UserContext } from "./UserContext";

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount or token change
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user info from backend
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER);
        const userData = response.data;

        console.log("User data fetched:", userData);

        setUser(userData);
        // Persist user data to localStorage
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to fetch user data:", error);

        // If token is invalid, clear everything
        if (error.response?.status === 401) {
          setUser(null);
          setToken("");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Login function
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
