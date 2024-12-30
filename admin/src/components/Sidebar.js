import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
  FaMoneyBill,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMoneyManagementOpen, setMoneyManagementOpen] = useState(false);
  const [isSubAdminOpen, setSubAdminOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/users", icon: FaUsers, label: "Users" },
    { path: "/orders", icon: FaChartLine, label: "Orders" },
    {
      path: "",
      icon: FaMoneyBill,
      label: "Money Management",
      isSubMenu: true,
    },
  ];

  // Add SubAdmins tab for superadmin
  if (user && user.role === "superadmin") {
    menuItems.splice(3, 0, {
      path: "",
      icon: FaUsers,
      label: "SubAdmins",
      isSubMenu: true,
    });
  }

  const isActive = (path) => location.pathname === path;

  const isMoneyManagementActive =
    isActive("/withdrawal-review") || isActive("/user-recharge");

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white fixed left-0 top-0 shadow-xl transform transition-all duration-300 ease-in-out z-50">
      <h2 className="text-2xl font-extrabold text-white my-6 pl-6 border-b-2 border-white">
        Admin Panel
      </h2>
      <div className="p-4 flex flex-col justify-between h-full">
        <nav>
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.isSubMenu ? (
                  <>
                    <button
                      onClick={
                        () =>
                          item.label === "Money Management"
                            ? setMoneyManagementOpen(!isMoneyManagementOpen)
                            : setSubAdminOpen(!isSubAdminOpen) // Toggle SubAdmins dropdown
                      }
                      className={`flex items-center space-x-4 p-3 rounded-lg w-full transition-colors duration-200 ease-in-out ${
                        (item.label === "Money Management" &&
                          (isMoneyManagementOpen || isMoneyManagementActive)) ||
                        (item.label === "SubAdmins" && isSubAdminOpen)
                          ? "text-yellow-400"
                          : "hover:bg-indigo-600"
                      }`}
                    >
                      <item.icon className="w-6 h-6 transition-all duration-200" />
                      <span className="text-lg font-semibold truncate">
                        {item.label}
                      </span>
                    </button>
                    <div
                      className={`ml-4 space-y-2 transform ${
                        item.label === "Money Management"
                          ? isMoneyManagementOpen
                            ? "max-h-screen opacity-100 ease-in-out"
                            : "max-h-0 opacity-0"
                          : isSubAdminOpen
                          ? "max-h-screen opacity-100 ease-in-out"
                          : "max-h-0 opacity-0"
                      } overflow-hidden transition-all duration-300`}
                    >
                      {item.label === "SubAdmins" && (
                        <>
                          <Link
                            to="/view-subadmins"
                            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out ${
                              isActive("/view-subadmins")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-indigo-600"
                            }`}
                          >
                            <span>View All SubAdmins</span>
                          </Link>
                          <Link
                            to="/create-subadmin"
                            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out ${
                              isActive("/create-subadmin")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-indigo-600"
                            }`}
                          >
                            <span>Create SubAdmin</span>
                          </Link>
                        </>
                      )}
                      {/* Existing dropdown for Money Management */}
                      {item.label === "Money Management" && (
                        <>
                          <Link
                            to="/withdrawal-review"
                            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out ${
                              isActive("/withdrawal-review")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-indigo-600"
                            }`}
                          >
                            <span>Withdrawal Review</span>
                          </Link>
                          <Link
                            to="/user-recharge"
                            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out ${
                              isActive("/user-recharge")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-indigo-600"
                            }`}
                          >
                            <span>User Recharge</span>
                          </Link>
                          <Link
                            to="/reputation-points"
                            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ease-in-out ${
                              isActive("/reputation-points")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-indigo-600"
                            }`}
                          >
                            <span>Reputation Points</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-4 p-3 rounded-lg w-full transition-colors duration-200 ease-in-out ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "hover:bg-indigo-600"
                    }`}
                  >
                    <item.icon className="w-6 h-6 transition-all duration-200" />
                    <span className="text-lg font-semibold">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/loginSubAdmin";
            }}
            className="flex items-center space-x-4 p-3 w-full rounded-lg hover:bg-indigo-600 transition-colors duration-200 ease-in-out"
          >
            <FaSignOutAlt className="w-6 h-6" />
            <span className="text-lg font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
