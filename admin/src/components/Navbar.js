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

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMoneyManagementOpen, setMoneyManagementOpen] = useState(false);
  const [isSubAdminOpen, setSubAdminOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

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

  const renderSubMenu = (label) => {
    if (label === "SubAdmins") {
      return (
        <>
          <Link
            to="/view-subadmins"
            onClick={() => setSubAdminOpen(false)}
            className={`block px-4 py-2 text-sm rounded-md ${
              isActive("/view-subadmins")
                ? "bg-blue-600 text-white"
                : "text-gray-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            View All SubAdmins
          </Link>
          <Link
            to="/create-subadmin"
            onClick={() => setSubAdminOpen(false)}
            className={`block px-4 py-2 text-sm rounded-md ${
              isActive("/create-subadmin")
                ? "bg-blue-600 text-white"
                : "text-gray-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            Create SubAdmin
          </Link>
        </>
      );
    }

    if (label === "Money Management") {
      return (
        <>
          <Link
            to="/withdrawal-review"
            onClick={() => setMoneyManagementOpen(false)}
            className={`block px-4 py-2 text-sm rounded-md ${
              isActive("/withdrawal-review")
                ? "bg-blue-600 text-white"
                : "text-gray-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            Withdrawal Review
          </Link>
          <Link
            to="/user-recharge"
            onClick={() => setMoneyManagementOpen(false)}
            className={`block px-4 py-2 text-sm rounded-md ${
              isActive("/user-recharge")
                ? "bg-blue-600 text-white"
                : "text-gray-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            User Recharge
          </Link>
          <Link
            to="/reputation-points"
            onClick={() => setMoneyManagementOpen(false)}
            className={`block px-4 py-2 text-sm rounded-md ${
              isActive("/reputation-points")
                ? "bg-blue-600 text-white"
                : "text-gray-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            Reputation Points
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Admin Panel</h1>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none hover:text-yellow-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Menu */}
          <ul
            className={`absolute sm:static top-16 left-0 w-full sm:w-auto bg-indigo-700 sm:bg-transparent sm:flex items-center space-y-10 sm:space-y-0 sm:space-x-6 px-4 sm:px-0 py-4 sm:py-0 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            {menuItems.map((item) => (
              <li key={item.label} className="relative">
                {item.isSubMenu ? (
                  <div>
                    <button
                      onClick={() => {
                        // Toggle submenu open/close
                        if (item.label === "Money Management") {
                          setMoneyManagementOpen(!isMoneyManagementOpen);
                          setSubAdminOpen(false); // Close SubAdmins dropdown
                        } else if (item.label === "SubAdmins") {
                          setSubAdminOpen(!isSubAdminOpen);
                          setMoneyManagementOpen(false); // Close Money Management dropdown
                        }
                        setMenuOpen(true); // Keep the menu open when clicking the button
                      }}
                      className={`flex items-center space-x-2 w-full text-left ${
                        (item.label === "Money Management" &&
                          isMoneyManagementOpen) ||
                        (item.label === "SubAdmins" && isSubAdminOpen)
                          ? "text-yellow-400"
                          : "hover:text-yellow-300"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                    {((item.label === "Money Management" &&
                      isMoneyManagementOpen) ||
                      (item.label === "SubAdmins" && isSubAdminOpen)) && (
                      <div className="absolute bg-indigo-600 text-white rounded-md mt-2 shadow-lg w-48 z-10">
                        {renderSubMenu(item.label)}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => {
                      setMenuOpen(false); // Close the menu when clicking a link
                      setMoneyManagementOpen(false); // Close Money Management submenu
                      setSubAdminOpen(false); // Close SubAdmin submenu
                    }}
                    className={`flex items-center space-x-2 ${
                      isActive(item.path)
                        ? "text-yellow-400"
                        : "hover:text-yellow-300"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}

            {/* Logout Button (always visible) */}
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/loginSubAdmin";
                }}
                className="flex items-center space-x-2 w-full  hover:text-yellow-300"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
