import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  FaUserCircle,
  FaReceipt,
  FaEnvelope,
  FaInfoCircle,
  FaArrowRight,
  FaLock,
  FaMoneyBill,
} from "react-icons/fa";

const Profile2 = () => {
  const { user, fetchUserProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-300">
      {/* User Info Section */}
      <div className="relative">
        <div className="relative w-full bg-gradient-to-br from-blue-400 via-purple-500 to-red-500 shadow-2xl rounded-lg overflow-hidden p-6">
          {/* User Icon */}
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/4 flex items-center justify-center">
              <div className="relative">
                <FaUserCircle
                  className="text-white drop-shadow-lg"
                  size={120}
                />
                <div className="absolute bottom-0 right-0 bg-gradient-to-tr from-green-400 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  {user ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="md:w-3/4 mt-6 md:mt-0 md:ml-6 p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
              {user ? (
                <div className="space-y-4 text-white">
                  <p>
                    <span className="font-semibold text-blue-200">ID:</span>{" "}
                    <span className="text-blue-50">{user._id}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-blue-200">
                      User Name:
                    </span>{" "}
                    <span className="text-blue-50">{user.email}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-blue-200">
                      My Balance:
                    </span>{" "}
                    <span
                      className={`px-3 py-1 rounded-lg ${
                        user.isBalanceFrozen
                          ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {user.balance || "0"}
                    </span>
                    {user.isBalanceFrozen && (
                      <span className="ml-2 inline-flex items-center">
                        <FaLock className="text-red-500 mr-1" size={18} />
                        <span className="text-red-400 text-sm px-2 py-1 bg-red-100 rounded-lg shadow-md">
                          Frozen
                        </span>
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-200">
                      Reputation Points:
                    </span>{" "}
                    <span className="text-blue-50">
                      {user.reputationPoints || "0"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-blue-200">
                      VIP Level:
                    </span>{" "}
                    <span className="text-blue-50">
                      {user.vipLevel || "Basic"}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-blue-50">
                  You are not logged in. Please log in to view your profile.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-300 to-transparent">
          <div className="flex justify-center space-x-1">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-blue-400 rounded-full ${
                  i % 2 === 0 ? "translate-y-2" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Rows Section */}
      <div className="mt-6 mx-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 mb-20 md:mb-0">
        <div
          onClick={() => handleNavigation("/receiptInformation")}
          className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg cursor-pointer transition-transform transform "
        >
          <div className="flex items-center">
            <FaReceipt className="text-blue-500 mr-4" size={30} />
            <p className="font-semibold text-gray-700">Receipt Information</p>
          </div>
          <FaArrowRight className="text-gray-400" size={20} />
        </div>

        <div
          onClick={() => handleNavigation("/withdrawls")}
          className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg cursor-pointer transition-transform transform"
        >
          <div className="flex items-center">
            <FaMoneyBill className="text-blue-500 mr-4" size={30} />
            <p className="font-semibold text-gray-700">Withdraw to Bank</p>
          </div>
          <FaArrowRight className="text-gray-400" size={20} />
        </div>

        <div
          onClick={() => handleNavigation("/messages")}
          className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg cursor-pointer transition-transform transform "
        >
          <div className="flex items-center">
            <FaEnvelope className="text-green-500 mr-4" size={30} />
            <p className="font-semibold text-gray-700">User Messages</p>
          </div>
          <FaArrowRight className="text-gray-400" size={20} />
        </div>

        <div
          onClick={() => handleNavigation("/aboutUs")}
          className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg cursor-pointer transition-transform transform "
        >
          <div className="flex items-center">
            <FaInfoCircle className="text-purple-500 mr-4" size={30} />
            <p className="font-semibold text-gray-700">About Us</p>
          </div>
          <FaArrowRight className="text-gray-400" size={20} />
        </div>

        <div
          onClick={() => logout()}
          className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg cursor-pointer transition-transform transform "
        >
          <div className="flex items-center">
            <FaLock className="text-yellow-500 mr-4" size={30} />
            <p className="font-semibold text-gray-700">Logout</p>
          </div>
          <FaArrowRight className="text-gray-400" size={20} />
        </div>
      </div>
    </div>
  );
};

export default Profile2;