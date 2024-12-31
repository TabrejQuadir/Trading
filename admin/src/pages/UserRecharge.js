import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Assuming useAuth is in AuthContext.js

const UserRecharge = () => {
  const { fetchAllUsers, fetchRegisteredUsers, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amounts, setAmounts] = useState({}); // Track amounts for each user
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
      setFilteredUsers(usersData); // Set the initial filtered users
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

  // Filter users based on search term
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const filtered = users.filter(
        (refUser) =>
          refUser._id.toLowerCase().includes(term.toLowerCase()) ||
          refUser.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // If search term is empty, show all users
    }
  };

  const handleBalanceUpdate = async (userId, action) => {
    try {
      const endpoint =
        action === "add"
          ? "https://trading-backendd.onrender.com/api/auth/add-balance"
          : "https://trading-backendd.onrender.com/api/auth/deduct-balance";

      const response = await axios.post(
        endpoint,
        { userId, amount: amounts[userId] || 0 }, // Use the specific user's amount
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is included
          },
        }
      );
      alert(response.data.message);

      // Reset the input field for this user
      setAmounts((prev) => ({
        ...prev,
        [userId]: 0,
      }));

      // Fetch updated user data
      await getUsers();
    } catch (err) {
      console.error(
        `Error ${action === "add" ? "adding" : "deducting"} balance:`,
        err
      );
      setError(`Failed to ${action === "add" ? "add" : "deduct"} balance.`);
    }
  };

  const handleAmountChange = (userId, value) => {
    setAmounts((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  // Function to update balance frozen status
  const handleFrozenStatusUpdate = async (userId, isFrozen) => {
    try {
      const response = await axios.post(
        "https://trading-backendd.onrender.com/api/auth/update-balance-frozen",
        { userId, isFrozen },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      // Fetch updated user data
      await getUsers();
    } catch (err) {
      console.error("Error updating frozen status:", err);
      setError("Failed to update frozen status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          User Recharge
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by User ID or Email"
            value={searchTerm}
            onChange={handleSearch}
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
                className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 rounded-md p-4 shadow-md hover:shadow-lg transition mb-4"
              >
                <div className="sm:w-2/5">
                  <p className="text-gray-800 font-semibold">{refUser.email}</p>
                  <p className="text-gray-600">Balance: {refUser.balance}</p>
                  <p className="text-gray-600">
                    Frozen: {refUser.isBalanceFrozen ? "Yes" : "No"}
                  </p>
                </div>
                <div className="w-full sm:w-3/5 space-y-4 sm:space-y-0">
                  {/* Amount Input Field */}
                  <div className="w-full sm:w-auto mb-4">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={amounts[refUser._id] || ""}
                      onChange={(e) =>
                        handleAmountChange(refUser._id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                    />
                  </div>
                  
                  {/* Buttons */}
                  <div className="w-full flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-2">
                    <button
                      onClick={() => handleBalanceUpdate(refUser._id, "add")}
                      className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition"
                    >
                      Add Balance
                    </button>
                    <button
                      onClick={() => handleBalanceUpdate(refUser._id, "deduct")}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition"
                    >
                      Deduct Balance
                    </button>
                    <button
                      onClick={() =>
                        handleFrozenStatusUpdate(
                          refUser._id,
                          !refUser.isBalanceFrozen
                        )
                      }
                      className={`w-full sm:w-auto px-4 py-2 ${
                        refUser.isBalanceFrozen
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      } text-white font-semibold rounded-md shadow hover:${
                        refUser.isBalanceFrozen
                          ? "bg-blue-600"
                          : "bg-yellow-600"
                      } transition`}
                    >
                      {refUser.isBalanceFrozen ? "Unfreeze" : "Freeze"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserRecharge;
