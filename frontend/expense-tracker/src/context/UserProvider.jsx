// src/context/UserProvider.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { UserContext } from "./UserContext";

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Fetch user/dashboard data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Login function
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
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
