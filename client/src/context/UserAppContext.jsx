import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const UserAppContext = createContext();

const UserAppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Fetch user profile if token exists
  useEffect(() => {
    if (token) {
      axios
        .get("https://folder-gxr1.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          setToken("");
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };


  const value = { user, token, login, logout }

  return (
    <UserAppContext.Provider value={value}>
      {children}
    </UserAppContext.Provider>
  );
};

export default UserAppProvider;
