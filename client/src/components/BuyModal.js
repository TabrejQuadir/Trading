import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import OrderContext from "../context/OrderContext"; // Import OrderContext
import axios from "axios"; // For making API requests

const BuyModal = ({
  onClose,
  type,
  symbol,
  currentCurrency,
  onOrderCreated,
}) => {
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const { createOrder } = useContext(OrderContext); // Access createOrder from OrderContext
  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const server = "https://trading-backendd.onrender.com";

  console.log(user, "user");

  const timeOptions = [
    { time: "30s", profit: 50 },
    { time: "60s", profit: 40 },
    { time: "90s", profit: 30 },
    { time: "120s", profit: 20 },
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
    calculateIncome(amount, index);
  };

  const handleAmountChange = (e) => {
    const enteredAmount = parseFloat(e.target.value);

    if (enteredAmount > user.balance) {
      alert("You cannot invest more than your available balance.");
      setAmount(0); // Reset the amount to 0
    } else {
      setAmount(enteredAmount);
      calculateIncome(enteredAmount, activeTab);
    }
  };

  const calculateIncome = (enteredAmount, tabIndex) => {
    const profitPercentage = timeOptions[tabIndex].profit;
    const calculatedProfit = (enteredAmount * profitPercentage) / 100;
    const calculatedTotalIncome = enteredAmount + calculatedProfit;
    setTotalIncome(calculatedTotalIncome);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  useEffect(() => {
    setIsClosing(false);
  }, []);

  const handleConfirmOrder = async () => {
    const orderData = {
      userId: user._id, // Use user ID from AuthContext
      symbol,
      direction: type,
      investment: amount,
      duration: timeOptions[activeTab].time,
      profitPercentage: timeOptions[activeTab].profit,
      orderPrice: currentCurrency.price,
    };
  
    try {
      const newOrder = await createOrder(orderData); // Call createOrder from OrderContext
      alert("Order created successfully!");
      onOrderCreated(newOrder); // Pass the created order to the parent
      handleClose(); // Close modal after successful order creation
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Full error object:", error);
  
      if (error.response) {
        console.error("Server error response:", error.response.data);
        if (error.response.data && error.response.data.message) {
          alert(error.response.data.message); // Show the specific error message
        } else {
          alert("An unexpected error occurred. Please try again."); // Fallback message
        }
      } else if (error.message) {
        alert(error.message); // Show the custom error message (e.g., balance frozen)
      } else {
        alert("Failed to create order. Please check your network connection."); // Generic fallback
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end transition-all duration-500 transform ${
        isClosing ? "animate-slideOutToBottom" : "animate-slideInFromBottom"
      }`}
    >
      <div className="w-full bg-white text-gray-900 shadow-2xl transition-all duration-500 transform rounded-t-3xl">
        <div className="flex justify-between items-center p-6 py-3 bg-black border rounded-t-3xl">
          <h2 className="text-2xl font-semibold text-white">
            {type === "Buy Up" ? "Buy Up" : "Buy Down"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-300 text-3xl hover:text-white transition duration-200"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Symbol: {symbol}</h3>
            <p className="text-sm text-black">
              Current Price: <strong>{currentCurrency.price}</strong>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {timeOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`py-4 px-8 rounded-lg transition duration-300 bg-slate-200 ${
                  activeTab === index
                    ? "border-4 border-black text-black"
                    : "text-gray-700 hover:border-2 hover:border-slate-900"
                } md:flex-1 sm:w-1/2`}
              >
                {option.time} <br />{" "}
                {/* <span className="text-green-600">Profit {option.profit}%</span> */}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">Available Balance:</p>
              <p className="text-sm font-semibold">{user?.balance}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">Total Income:</p>
              <p className="text-sm font-semibold">{totalIncome.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-3 text-gray-700 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter amount to trade"
            />
          </div>
        </div>

        <button
          onClick={handleConfirmOrder}
          className="w-[98%] py-4 px-8 mb-2 rounded-lg font-semibold bg-black text-white ml-4 transition"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default BuyModal;
