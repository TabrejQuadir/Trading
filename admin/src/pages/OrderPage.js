import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const OrderPage = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response =
          user.role === "superadmin"
            ? await fetch(
                "https://trading-backendd.onrender.com/api/orders/superadmin/allOrders"
              )
            : await fetch(
                `https://trading-backendd.onrender.com/api/orders/subadmin/${user.userId}`
              );

        const data = await response.json();
        if (response.ok) {
          const fetchedOrders = data.orders || data;
          // Sort orders by createdAt in descending order
          fetchedOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(fetchedOrders);
        } else {
          throw new Error(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const filteredOrders = orders?.filter((order) => {
    const userIdMatch =
      typeof order.userId === "string"
        ? order.userId.includes(searchQuery)
        : order.userId?._id?.toString()?.includes(searchQuery);

    const orderIdMatch = order._id?.toString()?.includes(searchQuery);
    return userIdMatch || orderIdMatch;
  });

  const closeModal = () => setSelectedOrder(null);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-200 min-h-screen">
      <h1 className="text-4xl font-semibold text-gray-900 mb-6 text-center">
        Order Management
      </h1>

      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search by User ID, Email, or Admin Reference ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
      </div>

      {/* Card Layout for Small and Medium Devices */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-4 md:hidden">
        <div className="space-y-4">
          {filteredOrders.length === 0 && (
            <div className="flex justify-center items-center h-screen text-xl text-gray-500">
              No orders found
            </div>
          )}
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-6 border-b border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="font-semibold text-lg text-indigo-600">
                Order ID:
              </div>
              <div className="text-gray-600">{order._id}</div>

              <div className="font-semibold text-lg text-indigo-600">
                Symbol:
              </div>
              <div className="text-gray-600">{order.symbol}</div>

              <div className="font-semibold text-lg text-indigo-600">
                Investment:
              </div>
              <div className="text-gray-600">
                ${order.investment.toFixed(2)}
              </div>

              <div className="font-semibold text-lg text-indigo-600">
                Created At:
              </div>
              <div className="text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <button
                onClick={() => setSelectedOrder(order)}
                className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 shadow-lg transition duration-200 transform hover:scale-105"
              >
                View More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Table Layout for Large Devices */}
      <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden mx-4 ">
        <div className="overflow-x-auto ">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b border-gray-200">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b border-gray-200">
                  Symbol
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b border-gray-200">
                  Investment
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b border-gray-200">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 && (
                <div className="flex justify-center items-center h-screen text-xl text-gray-500">
                  No orders found
                </div>
              )}
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-indigo-50 transition duration-300 ease-in-out"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    {order._id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    {order.symbol}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    ${order.investment.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 shadow-lg transform transition duration-300 hover:scale-105"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 relative animate-fadeIn transition-transform transform-gpu">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">
              Order Details
            </h2>
            <div className="space-y-3">
              <p>
                <strong className="text-gray-600">User ID:</strong>{" "}
                {selectedOrder.userId}
              </p>
              <p>
                <strong className="text-gray-600">Order ID:</strong>{" "}
                {selectedOrder._id}
              </p>
              <p>
                <strong className="text-gray-600">Symbol:</strong>{" "}
                {selectedOrder.symbol}
              </p>
              <p>
                <strong className="text-gray-600">Direction:</strong>{" "}
                {selectedOrder.direction}
              </p>
              <p>
                <strong className="text-gray-600">Investment:</strong> $
                {selectedOrder.investment.toFixed(2)}
              </p>
              <p>
                <strong className="text-gray-600">Order Price:</strong> $
                {selectedOrder.orderPrice}
              </p>
              <p>
                <strong className="text-gray-600">Close Out Price:</strong> $
                {selectedOrder.closeOutPrice}
              </p>
              <p>
                <strong className="text-gray-600">Profit/Loss:</strong>
                {selectedOrder.isWin
                  ? `Profit: $${
                      (selectedOrder.profitPercentage / 100) *
                      selectedOrder.investment
                    }`
                  : selectedOrder.isLoss
                  ? `Loss: $${selectedOrder.investment}`
                  : "N/A"}
              </p>
              <p>
                <strong className="text-gray-600">Status:</strong>{" "}
                {selectedOrder.status}
              </p>
              <p>
                <strong className="text-gray-600">Created At:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200 transform hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
