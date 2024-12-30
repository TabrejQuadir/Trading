import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaHistory, FaUser } from 'react-icons/fa';

const Footer = () => {
  const location = useLocation(); // Get current path

  const isActive = (path) => location.pathname === path; // Check if tab is active

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4">
      <div className="flex justify-around items-center">
        {/* Home Tab */}
        <Link
          to="/"
          className={`flex flex-col items-center ${
            isActive('/') ? 'text-blue-500' : 'text-gray-300'
          }`}
        >
          <FaHome size={24} />
          <span className="text-xs">Home</span>
        </Link>

        {/* Purchase Tab */}
        <Link
          to="/orderRecord"
          className={`flex flex-col items-center ${
            isActive('/orderRecord') ? 'text-blue-500' : 'text-gray-300'
          }`}
        >
          <FaShoppingCart size={24} />
          <span className="text-xs">Purchase</span>
        </Link>

        {/* Record Tab */}
        <Link
          to="/withdrawalRecord"
          className={`flex flex-col items-center ${
            isActive('/withdrawalRecord') ? 'text-blue-500' : 'text-gray-300'
          }`}
        >
          <FaHistory size={24} />
          <span className="text-xs">Record</span>
        </Link>

        {/* User Tab */}
        <Link
          to="/profile"
          className={`flex flex-col items-center ${
            isActive('/profile') ? 'text-blue-500' : 'text-gray-300'
          }`}
        >
          <FaUser size={24} />
          <span className="text-xs">User</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
