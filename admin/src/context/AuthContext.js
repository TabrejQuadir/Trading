import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminRegistered, setAdminRegistered] = useState(false);
  const [subAdminRegistered, setSubAdminRegistered] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const loginAdmin = async (adminData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        adminData
      );
      localStorage.setItem("token", response.data.token);
      const decoded = jwtDecode(response.data.token);
      setUser(decoded);
      return response.data;
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  };

  const registerSubAdmin = async (subAdminData) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage

      const response = await axios.post(
        "http://localhost:5000/api/admin/registerSubAdmin",
        subAdminData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      setSubAdminRegistered(true);
      return response.data;
    } catch (error) {
      console.error("Sub-admin registration failed:", error);
      throw error;
    }
  };

  const registerSuperAdmin = async (adminData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/registerSuperAdmin",
        adminData
      );
      setAdminRegistered(true);
      return response.data;
    } catch (error) {
      console.error("Admin registration failed:", error);
      throw error;
    }
  };

  const fetchRegisteredUsers = async () => {
    console.log("Fetching registered users...");

    try {
      // Make the API call
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Log and return the response data
      console.log("API Response:", response.data);

      if (response.data.success) {
        const { data, message } = response.data;
        console.log(message);
        return data; // Return the filtered users data
      } else {
        console.warn(
          "API Response indicates a failure:",
          response.data.message
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching registered users:", error);
      if (error.response) {
        console.error(
          "Error Response:",
          error.response.data.message || error.response.statusText
        );
      } else if (error.request) {
        console.error("No response received from the server.");
      } else {
        console.error("Error occurred while setting up the request.");
      }

      throw error;
    }
  };

  const fetchAllUsers = async () => {
    console.log("Fetching all users..."); // Log the call
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/all-users",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data) {
        return response.data; // Return the users data
      } else {
        console.warn(
          "API Response indicates a failure:",
          response.data.message
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  };

  const fetchSubAdmins = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/subadmins",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data; // Return the sub-admins data
    } catch (error) {
      console.error("Error fetching sub-admins:", error);
      throw error; // Propagate the error
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setUser(null); // Reset user state
    setLoading(true); // Optionally set loading to true to re-check auth status
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loginAdmin,
        registerSuperAdmin,
        registerSubAdmin,
        adminRegistered,
        subAdminRegistered,
        fetchRegisteredUsers,
        fetchSubAdmins,
        fetchAllUsers,
        logout, // Add logout to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
