import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Assuming useAuth is in AuthContext.js

const ReputationPoints = () => {
  const { fetchAllUsers, fetchRegisteredUsers, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState({}); // Track reputation points for each user
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Function to fetch users
  const getUsers = async () => {
    try {
      setLoading(true); // Set loading to true while fetching users
      let usersData;
      if (user.role === "superadmin") {
        usersData = await fetchAllUsers();
      } else if (user.role === "subadmin") {
        usersData = await fetchRegisteredUsers();
      }
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [fetchAllUsers, fetchRegisteredUsers, user.role]);

  // Function to handle adding or deducting points
  const handlePointsUpdate = async (userId, action) => {
    try {
      const endpoint =
        action === "add"
          ? "http://localhost:5000/api/auth/add-reputation"
          : "http://localhost:5000/api/auth/deduct-reputation";

      const response = await axios.post(
        endpoint,
        { userId, points: points[userId] || 0 }, // Use the specific user's points
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is included
          },
        }
      );
      alert(response.data.message);

      // Reset the input field for this user
      setPoints((prev) => ({
        ...prev,
        [userId]: 0,
      }));

      // Fetch updated user data
      await getUsers();
    } catch (err) {
      console.error(`Error ${action === "add" ? "adding" : "deducting"} points:`, err);
      setError(`Failed to ${action === "add" ? "add" : "deduct"} points.`);
    }
  };

  const handlePointsChange = (userId, value) => {
    setPoints((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  // Filter users based on search query (user ID or email)
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Manage Reputation Points
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by User ID or Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-700">
            <span>Loading users...</span>
            <div className="loader mt-4"></div> {/* Add a spinner here */}
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.map((refUser) => (
              <li
                key={refUser._id}
                className="flex flex-col md:flex-row items-center justify-between bg-gray-100 rounded-md p-4 shadow-md hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-0">
                  <p className="text-gray-800 font-semibold">{refUser.email}</p>
                  <p className="text-gray-600 ml-0 md:ml-4">
                    Reputation Points: {refUser.reputationPoints}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Points"
                    value={points[refUser._id] || ""}
                    onChange={(e) => handlePointsChange(refUser._id, e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300 mb-2 md:mb-0"
                  />
                  <button
                    onClick={() => handlePointsUpdate(refUser._id, "add")}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition mb-2 md:mb-0"
                  >
                    Add Points
                  </button>
                  <button
                    onClick={() => handlePointsUpdate(refUser._id, "deduct")}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition"
                  >
                    Deduct Points
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReputationPoints;
