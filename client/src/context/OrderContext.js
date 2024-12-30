import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [userOrders, setUserOrders] = useState([]);
  const server = "http://localhost:5000";
  const { updateUserBalance } = useContext(AuthContext);

  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const createOrder = async (orderData) => {
    try {
      console.log("Creating order with data:", orderData);
      if (!orderData || typeof orderData !== "object") {
        console.error("Invalid order data format:", orderData);
        throw new Error("Invalid order data format");
      }

      const response = await axios.post(
        `${server}/api/orders/create`,
        orderData,
        getAxiosConfig()
      );

      console.log("Order API response:", response.data);

      if (response.status === 201) {
        updateUserBalance(response.data.remainingBalance);
        // Instead of adding to state, fetch fresh data
        await getUserOrders(response.data.order.userId);
        return response.data.order;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
        if (error.response.status === 403) {
          // Attach the response to the error before throwing
          error.message = "User's balance is frozen. Cannot place order.";
        }
      }
      throw error; // Preserve the original error context
    }
  };

  const getUserOrders = useCallback(async (userId) => {
    if (!userId) {
      console.error("No userId provided to getUserOrders");
      return;
    }

    try {
      console.log("Fetching orders for userId:", userId);
      const response = await axios.get(
        `${server}/api/orders/user/${userId}`,
        getAxiosConfig()
      );

      console.log("Orders API response:", response.data);

      if (response.data && Array.isArray(response.data.orders)) {
        // Sort orders by creation date, newest first
        const sortedOrders = [...response.data.orders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserOrders(sortedOrders);
      } else {
        console.error("Invalid orders data format:", response.data);
        throw new Error("Invalid orders data format received from server");
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
      }
      throw error;
    }
  }, []); // Empty dependency array since it doesn't depend on any props or state

  return (
    <OrderContext.Provider
      value={{ userOrders, setUserOrders, createOrder, getUserOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
