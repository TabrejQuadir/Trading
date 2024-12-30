import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { FaMoneyBill } from "react-icons/fa";

const WithdrawalRecord = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext); // Get user context

  useEffect(() => {
    const fetchWithdrawalRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/withdrawals?userId=${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is included
            },
          }
        );

        setRecords(response.data.requests); // Assuming 'requests' is the key in the response
      } catch (err) {
        setError("Error fetching withdrawal records.");
        console.error("Error fetching records:", err);
      }
    };

    fetchWithdrawalRecords();
  }, [user._id]); // Dependency on user ID

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Withdrawal Records
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</div>
      )}

      {/* Mobile Layout */}
      <div className="block md:hidden">
        {records.length > 0 ? (
          records.map((record) => (
            <div
              key={record._id}
              className="bg-white shadow-lg rounded-lg p-6 mb-4 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <h2 className="font-semibold text-lg text-blue-600 flex items-center">
                <FaMoneyBill className="mr-2" size={20} />
                {record.bankDetails.bankName}
              </h2>
              <p className="text-gray-700">
                <strong>Account Number:</strong>{" "}
                {record.bankDetails.accountNumber}
              </p>
              <p className="text-gray-700">
                <strong>IFSC/Branch Code:</strong>{" "}
                {record.bankDetails.ifscCode || record.bankDetails.branchCode}
              </p>
              <p className="text-gray-700">
                <strong>Amount:</strong> {record.amount}
              </p>
              <p className="text-gray-700">
                <strong>Currency:</strong> {record.currency}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {record.status}
              </p>
              <p className="text-gray-700">
                <strong>Requested At:</strong>{" "}
                {new Date(record.requestedAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No withdrawal records available.
          </p>
        )}
      </div>

      {/* Table for Medium and Large Devices */}
      <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 sm:px-6 text-left">Bank Name</th>
              <th className="py-3 px-4 sm:px-6 text-left">Account Number</th>
              <th className="py-3 px-4 sm:px-6 text-left">IFSC/Branch Code</th>
              <th className="py-3 px-4 sm:px-6 text-left">Amount</th>
              <th className="py-3 px-4 sm:px-6 text-left">Currency</th>
              <th className="py-3 px-4 sm:px-6 text-left">Status</th>
              <th className="py-3 px-4 sm:px-6 text-left">Requested At</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {records.length > 0 ? (
              records.map((record) => (
                <tr
                  key={record._id}
                  className="hover:bg-gray-100 transition-colors duration-300"
                >
                  <td className="py-4 px-4 sm:px-6 border-b">
                    {record.bankDetails.bankName}
                  </td>
                  <td className="py-4 px-4 sm:px-6 border-b">
                    {record.bankDetails.accountNumber}
                  </td>
                  <td className="py-4 px-4 sm:px-6 border-b">
                    {record.bankDetails.ifscCode ||
                      record.bankDetails.branchCode}
                  </td>
                  <td className="py-4 px-4 sm:px-6 border-b">
                    {record.amount}
                  </td>
                  <td className="py-4 px-4 sm:px-6 border-b">
                    {record.currency}
                  </td>
                  <td className="py-4 px-4 sm:px-6 border-b">
                    {record.status}
                  </td>
                  <td className="py-4 px-4 sm:px-6 border-b">
                    {new Date(record.requestedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No withdrawal records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalRecord;
