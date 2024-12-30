import React, { useState, useEffect } from "react";
import { FaUsers, FaExchangeAlt, FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const { user, fetchRegisteredUsers, fetchAllUsers, fetchSubAdmins } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubAdminsData = async () => {
      if (user && user.role === "superadmin") {
        try {
          const subAdminData = await fetchSubAdmins();
          setSubAdmins(subAdminData.data);
          const allUsersData = await fetchAllUsers();
          setAllUsers(allUsersData);
        } catch (error) {
          console.error("Failed to fetch sub-admins:", error);
        }
      }
    };
    fetchSubAdminsData();
  }, [user, fetchSubAdmins]);

  useEffect(() => {
    const fetchRegisteredUsersData = async () => {
      if (user && user.role === "subadmin") {
        try {
          const registeredUsersData = await fetchRegisteredUsers();
          if (registeredUsersData) {
            setRegisteredUsers(registeredUsersData);
          }
        } catch (error) {
          console.error("Error fetching registered users:", error);
        }
      }
    };
    fetchRegisteredUsersData();
  }, [user, fetchRegisteredUsers]);

  const StatCard = ({ icon: Icon, title, value, bgColor }) => (
    <div
      className={`${bgColor} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className="opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="p-6 relative z-0 ">
      <div className="border border-black rounded-xl p-6 py-3 items-center shadow-lg flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <p className="font-semibold text-gray-800 text-center md:text-left">
          Welcome,{" "}
          {user.role === "superadmin"
            ? `Super Admin`
            : user.role === "subadmin"
            ? `Sub Admin`
            : "Sub Admin"}
          !
        </p>
        <p className="font-semibold text-gray-800 text-center md:text-left">
          Your Admin ID: {user.userId}
        </p>
        <p className="font-semibold text-gray-800 text-center md:text-left">
          Your Invitation Code:
          <span className="font-bold text-black">-{user.invitationCode}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user.role === "superadmin" && (
          <StatCard
            icon={FaUsers}
            title="Sub Admins"
            value={subAdmins.length}
            bgColor="bg-gradient-to-r from-yellow-500 to-green-600"
          />
        )}
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={
            user.role === "superadmin"
              ? allUsers.length
              : registeredUsers.length
          }
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          icon={FaExchangeAlt}
          title="Total Transactions"
          value={0} // Placeholder for total transactions
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Total Revenue"
          value={0} // Placeholder for total revenue
          bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">Loading recent activities...</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/users")}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View All Users
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/withdrawal-review")}
              className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              View Withdrawals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
