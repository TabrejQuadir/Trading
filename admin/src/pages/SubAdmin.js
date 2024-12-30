import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaUserAlt, FaRegClock, FaCogs, FaSearch } from 'react-icons/fa';

const SubAdmin = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [filteredSubAdmins, setFilteredSubAdmins] = useState([]);
  const { fetchSubAdmins, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubAdminsData = async () => {
      if (user && user.role === 'superadmin') {
        try {
          const subAdminData = await fetchSubAdmins(); // Call the context function directly
          setSubAdmins(subAdminData.data); // Assuming subAdminData has a data property
          setFilteredSubAdmins(subAdminData.data); // Initially show all subAdmins
        } catch (error) {
          console.error('Failed to fetch sub-admins:', error);
          setError(error.message);
        }
      }
      setLoading(false);
    };

    fetchSubAdminsData(); // Call the function to fetch data
  }, [user, fetchSubAdmins]);

  useEffect(() => {
    const filteredData = subAdmins.filter(
      (subAdmin) =>
        subAdmin._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subAdmin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubAdmins(filteredData);
  }, [searchTerm, subAdmins]);

  if (loading) return <div className="text-center text-xl text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-200 min-h-screen">
      <h1 className="text-4xl font-semibold text-gray-900 mb-6 text-center">Sub Admin Management</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full ">
          <input
            type="text"
            placeholder="Search by ID or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>
      </div>

      {/* Card Layout for Medium and Small Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:hidden">
        {filteredSubAdmins.map((subAdmin) => (
          <div
            key={subAdmin._id}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <FaUserAlt className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">{subAdmin.name}</h2>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              <FaEnvelope className="inline w-4 h-4 mr-2 text-blue-500" />
              {subAdmin.email}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <FaCogs className="inline w-4 h-4 mr-2 text-blue-500" />
              {subAdmin.role}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Status:</span> {subAdmin.status}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <FaRegClock className="inline w-4 h-4 mr-2 text-blue-500" />
              {new Date(subAdmin.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Created By:</span> {subAdmin.createdBy}
            </p>
          </div>
        ))}
      </div>

      {/* Table Layout for Large Devices */}
      <div className="hidden lg:block bg-white shadow-2xl rounded-2xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-left uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-left uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-sm font-semibold text-left uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-sm font-semibold text-left uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-left uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-sm font-semibold text-left uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-sm font-semibold text-left uppercase tracking-wider">Admin ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredSubAdmins.map((subAdmin) => (
                <tr
                  key={subAdmin._id}
                  className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 cursor-pointer transition duration-300"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{subAdmin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{subAdmin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{subAdmin.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{subAdmin.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {new Date(subAdmin.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{subAdmin.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{subAdmin._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubAdmin;