import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
  const server = 'http://localhost:5000';
  const [loading, setLoading] = useState(true); // Loading state for initial auth check
  console.log("User ID:", user?._id); 

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${server}/api/auth/login`, { email, password });

      if (response.data.token) {
        // Save token and user data to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setUser(response.data.user);
        setIsAuthenticated(true);

        return true; // Login successful
      } else {
        return false; // Login failed (no token)
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed! Please check your credentials.');
      return false; // Handle error and return false
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post(`${server}/api/auth/register`, formData);
      console.log(response.data)
      return response; // Return the full response to handle in handleSubmit
    } catch (error) {
      // Return the error response with message in case of failure
      if (error.response) {
        return error.response; // If the error has a response, return that
      } else {
        throw error; // Otherwise, throw the error
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserBalance = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUser(response.data); // Update user state
        localStorage.setItem('user', JSON.stringify(response.data)); // Save updated user data to localStorage
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Log specific error messages to get more details on the issue
      if (error.response) {
        // Error response from the server
        console.error('Server Response:', error.response.data);
      } else {
        // Network or other errors
        console.error('Network or other errors:', error.message);
      }

      alert('Failed to fetch user profile!');
      setIsAuthenticated(false);
      logout(); // Log out if fetching the profile fails
    }
  };

  useEffect(() => {
    // Check if the user is already logged in on app load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    // Fetch user profile only if no user is available
    if (token && !storedUser) {
      fetchUserProfile(); // Fetch the user profile from server if only token exists
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateUserBalance, fetchUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
