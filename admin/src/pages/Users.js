import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchAllUsers, fetchRegisteredUsers, user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState({});
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        let usersData;
        if (user.role === "superadmin") {
          usersData = await fetchAllUsers();
        } else if (user.role === "subadmin") {
          usersData = await fetchRegisteredUsers();
        }
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    getUsers();
  }, [fetchAllUsers, fetchRegisteredUsers, user.role]);

  const handleToggleIsGonnaWin = (userId, currentStatus) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [userId]: currentStatus,
    }));
  };

  const handleUpdateStatus = async (userId) => {
    try {
      const newStatus = selectedStatus[userId];
      const response = await fetch(
        `http://localhost:5000/api/auth/isGonnaWin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            isGonnaWin: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isGonnaWin: newStatus } : user
          )
        );
        setMessage("Status updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        console.error("Error updating isGonnaWin:", data.message);
      }
    } catch (error) {
      console.error("Error toggling isGonnaWin:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const userIdMatch = user._id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const adminRefMatch = user.referredBy
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return userIdMatch || emailMatch || adminRefMatch;
  });

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-100 to-purple-200 min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          User Management
        </h1>
        {message && (
          <div className="text-center text-green-500 rounded-lg border border-teal-500 font-semibold p-4 bg-slate-100">
            {message}
          </div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by User ID, Email, or Admin Reference ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            {/* Table for large screens */}
            <table className="min-w-full divide-y divide-gray-200 hidden lg:table">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Admin Reference ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 cursor-pointer transition duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-800 font-semibold">
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.referredBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={
                              selectedStatus[user._id] ?? user.isGonnaWin
                            }
                            onChange={() =>
                              handleToggleIsGonnaWin(
                                user._id,
                                !(selectedStatus[user._id] ?? user.isGonnaWin)
                              )
                            }
                          />
                          <span className="ml-2 text-gray-700">
                            Is Gonna Win?
                          </span>
                        </label>
                        <button
                          onClick={() => handleUpdateStatus(user._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Card View for medium and small screens */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-800 font-semibold">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{user.name}</h2>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-900 mb-2">
                    <strong>User ID:</strong> {user._id}
                  </p>
                  <p className="text-sm text-gray-900 mb-4">
                    <strong>Admin Ref ID:</strong> {user.referredBy}
                  </p>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedStatus[user._id] ?? user.isGonnaWin}
                        onChange={() =>
                          handleToggleIsGonnaWin(
                            user._id,
                            !(selectedStatus[user._id] ?? user.isGonnaWin)
                          )
                        }
                      />
                      <span className="ml-2 text-gray-700">Is Gonna Win?</span>
                    </label>
                    <button
                      onClick={() => handleUpdateStatus(user._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
