import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import BankAccountContext from "../context/BankAccountContext";
import AuthContext from "../context/AuthContext";

const WithdrawalPage = () => {
  const { accounts } = useContext(BankAccountContext);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const { user } = useContext(AuthContext);

  console.log('user:', user);

  // Set default currency based on user country
  useEffect(() => {
    const currencyOptions = {
      India: "INR",
      Pakistan: "PKR",
      Russia: "RUB",
    };
    setCurrency(currencyOptions[user.country] || "");
  }, [user.country]);

  const handleAccountChange = (e) => {
    const selected = accounts.find((account) => account._id === e.target.value);
    setSelectedAccount(selected?._id);
    setAccountDetails(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!accountDetails) {
      setError("Please select a valid account.");
      return;
    }

    try {
      const response = await axios.post(
        "https://trading-backendd.onrender.com/api/withdrawals",
        {
          accountId: selectedAccount,
          currency,
          amount,
          bankName: accountDetails.bankName,
          accountNumber: accountDetails.accountNumber,
          branchCode: accountDetails.branchCode,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 backdrop-blur-xl relative">
      {/* Background Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-purple-200/20 to-pink-200/20 backdrop-blur-lg -z-10"></div>

      {/* Left Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-md">
        <div className="text-center space-y-6">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-800">
            Easy Withdrawals
          </h1>
          <p className="text-base lg:text-lg text-gray-700">
            Securely withdraw funds from your linked accounts in just a few
            clicks. Stay in control of your finances!
          </p>
          <div className="rounded-lg bg-gradient-to-r from-indigo-400/20 to-purple-400/20 p-4 text-sm text-gray-600 shadow-md">
            Tip: Double-check your account details before making a withdrawal
            to ensure smooth transactions.
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-10 mb-20 lg:mb-0">
        <div className="w-full max-w-lg bg-white bg-opacity-20 backdrop-blur-lg rounded-xl border border-gray-300 shadow-2xl p-6 lg:p-8 space-y-6">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            Withdrawal Form
          </h2>

          {message && (
            <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-md">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}

          {accounts.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="account"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Bank Account
                </label>
                <select
                  id="account"
                  value={selectedAccount}
                  onChange={handleAccountChange}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.bankName} - {account.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                  <option value="">Select currency</option>
                  {user.country === "India" && <option value="INR">INR</option>}
                  {user.country === "Pakistan" && <option value="PKR">PKR</option>}
                  {user.country === "Russia" && <option value="RUB">RUB</option>}
                </select>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  className="w-full p-3 rounded-md border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-500 hover:to-pink-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Withdraw
              </button>
            </form>
          ) : (
            <p className="text-center text-gray-500">
              No bank accounts available for withdrawal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;