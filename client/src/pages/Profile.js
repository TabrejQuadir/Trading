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

const Profile = () => {
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
        <div className="flex flex-col md:flex-row w-full bg-gradient-to-r from-blue-300 to-red-500 shadow-lg overflow-hidden rounded-lg">
          <div className="w-full md:w-1/4 flex items-center justify-center p-4">
            <FaUserCircle className="text-white" size={100} />
          </div>
          <div className="w-full md:w-3/4 p-6 bg-gradient-to-r from-red-300 to-red-400">
            {user ? (
              <div className="mt-4 text-black uppercase">
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">ID:</span>{" "}
                  {user._id}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">
                    User Name:
                  </span>{" "}
                  {user.email}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">
                    My Balance:
                  </span>{" "}
                  <span
                    className={`text-black ${
                      user.isBalanceFrozen
                        ? "bg-gradient-to-r from-red-400 to-red-600 text-white px-2 py-1 rounded-lg"
                        : ""
                    }`}
                  >
                    {user.balance || "0"}
                  </span>
                  {user.isBalanceFrozen && (
                    <span className="ml-2 inline-flex items-center">
                      <FaLock className="text-red-600 mr-1" size={18} />
                      <span className="text-red-500 font-semibold text-sm px-2 py-1 bg-red-100 rounded-full shadow-sm">
                        Frozen
                      </span>
                    </span>
                  )}
                </p>

                <p className="mb-2">
                  <span className="font-semibold text-gray-700">
                    Reputation Points:
                  </span>{" "}
                  {user.reputationPoints || "0"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    VIP Level:
                  </span>{" "}
                  {user.vipLevel || "Basic"}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">
                You are not logged in. Please log in to view your profile.
              </p>
            )}
          </div>
        </div>

        {/* Wave Pattern */}
        <div className="absolute -bottom-5 left-0 right-0 w-full flex justify-stretch overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-10 bg-gray-300"
              style={{
                borderRadius: "50%",
                transform: i % 2 === 0 ? "translateY(50%)" : "translateY(0)",
                marginLeft: "-28px",
                marginRight: "-4px",
              }}
            />
          ))}
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

export default Profile;
