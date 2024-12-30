import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const WithDrawReview = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filter, setFilter] = useState("All"); // State for filter
  const { user } = useContext(AuthContext); // Get user context

  useEffect(() => {
    const fetchWithdrawalRequests = async () => {
      try {
        let response;

        // Check user role and call the appropriate API
        if (user.role === "superadmin") {
          response = await axios.get(
            "http://localhost:5000/api/withdrawals/superAdmin/all",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } else if (user.role === "subadmin") {
          response = await axios.get(
            `http://localhost:5000/api/withdrawals/subadmin/${user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } else {
          throw new Error("Unauthorized role");
        }

        const requests =
          user.role === "superadmin"
            ? response.data.withdrawalRequests
            : response.data.withdrawalRequests;

        setWithdrawalRequests(requests);
      } catch (err) {
        setError("Error fetching withdrawal requests.");
        console.error("Error fetching requests:", err);
      }
    };

    fetchWithdrawalRequests();
  }, [user]);

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/withdrawals/subadmin/${user.userId}/update-status`,
        {
          requestId: selectedRequest._id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setWithdrawalRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === selectedRequest._id
            ? response.data.withdrawalRequest
            : request
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Safely filter withdrawal requests based on search query and selected filter
  const filteredRequests = (withdrawalRequests || []).filter((request) => {
    const userIdMatch =
      request?.userId?._id && typeof request.userId._id === "string"
        ? request.userId._id.toLowerCase().includes(searchQuery.toLowerCase())
        : false;

    const accountNumberMatch = request.bankDetails?.accountNumber
      ? request.bankDetails.accountNumber.toString().includes(searchQuery)
      : false;

    const statusMatch =
      filter === "All" ||
      (filter === "Pending" && request.status === "Pending") ||
      (filter === "Approved" && request.status === "Approved") ||
      (filter === "Rejected" && request.status === "Rejected");

    return (
      (userIdMatch || accountNumberMatch || searchQuery === "") && statusMatch
    ); // Include all if searchQuery is empty
  });

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Withdrawal Review</h1>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by User Id or Account Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap justify-center space-x-4">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`py-2 px-4 rounded-lg transition duration-300 ease-in-out ${
              filter === status
                ? "bg-blue-600 text-white shadow-lg transform scale-105"
                : "bg-gray-300 text-gray-800 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* On small/medium devices, show card format, on large devices show table */}
      <div className="md:hidden grid grid-cols-1 gap-4 mb-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-300"
            >
              <h3 className="font-bold text-lg text-indigo-700">
                {request.userId._id}
              </h3>
              <p>
                <strong>Bank Name:</strong> {request.bankDetails.bankName}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {request.bankDetails.accountNumber}
              </p>
              <p>
                <strong>Amount:</strong> {request.amount}
              </p>
              <p>
                <strong>Currency:</strong> {request.currency}
              </p>
              <button
                onClick={() => setSelectedRequest(request)} // Set selected request
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mt-4"
              >
                See Details
              </button>
            </div>
          ))
        ) : (
          <p>No withdrawal requests found.</p>
        )}
      </div>

      {/* Table for large devices */}
      <div
        className="hidden md:block overflow-y-auto shadow-lg rounded-lg border border-gray-300"
      >
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6 text-left">User Id</th>
              <th className="py-3 px-6 text-left">Bank Name</th>
              <th className="py-3 px-6 text-left">Account Number</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Currency</th>
              <th className="py-3 px-6 text-left">Details</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800 bg-white">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr
                  key={request._id}
                  className="hover:bg-gray-100 transition-colors duration-300"
                >
                  <td className="py-4 px-6 border-b">{request.userId._id}</td>
                  <td className="py-4 px-6 border-b">
                    {request.bankDetails.bankName}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {request.bankDetails.accountNumber}
                  </td>
                  <td className="py-4 px-6 border-b">{request.amount}</td>
                  <td className="py-4 px-6 border-b">{request.currency}</td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => setSelectedRequest(request)} // Set selected request
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      See Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center">
                  No withdrawal requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && ( // Modal for displaying request details
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 relative animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">
              Request Details
            </h2>
            <div className="space-y-3">
              <p>
                <strong className="text-gray-600">User Id:</strong>
                {selectedRequest.userId._id}
              </p>
              <p>
                <strong className="text-gray-600">Bank Name:</strong>
                {selectedRequest.bankDetails.bankName}
              </p>
              <p>
                <strong className="text-gray-600">Account Number:</strong>
                {selectedRequest.bankDetails.accountNumber}
              </p>
              <p>
                <strong className="text-gray-600">IFSC/Branch Code:</strong>
                {selectedRequest.bankDetails.ifscCode ||
                  selectedRequest.bankDetails.branchCode}
              </p>
              <p>
                <strong className="text-gray-600">Amount:</strong>
                {selectedRequest.amount}
              </p>
              <p>
                <strong className="text-gray-600">Currency:</strong>
                {selectedRequest.currency}
              </p>
              <p>
                <strong className="text-gray-600">Status:</strong>
                {selectedRequest.status}
              </p>
              <p>
                <strong className="text-gray-600">Requested At:</strong>
                {new Date(selectedRequest.requestedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between mt-4">
              {selectedRequest.status === "Pending" && ( // Only show buttons if the request is pending
                <>
                  <button
                    onClick={() => handleUpdateStatus("Approved")}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("Rejected")}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithDrawReview;
