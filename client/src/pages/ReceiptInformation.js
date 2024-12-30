import React, { useState, useEffect, useContext } from "react";
import { FaArrowLeft, FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import LoadingOverlay from "../components/LoadingOverlay";
import BankAccountContext from "../context/BankAccountContext"; // Adjust the path as necessary

const ReceiptInformation = () => {
  const {
    accounts,
    defaultAccount,
    loading,
    addAccount,
    editAccount,
    deleteAccount,
    setDefault,
  } = useContext(BankAccountContext);
  const { user } = useContext(AuthContext);


  // Log the accounts to see their IDs
  console.log("Accounts:", accounts);

  const [bankDetails, setBankDetails] = useState({
    userId: user._id,
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branchCode: "",
  });
  // const [accounts, setAccounts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  // const [defaultAccount, setDefaultAccount] = useState(0);
  // const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const handleSave = async () => {
    if (isEditing) {
      await editAccount(editIndex, bankDetails);
    } else {
      await addAccount(bankDetails);
    }
    setBankDetails({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      branchCode: "",
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setBankDetails(accounts[index]);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this bank account?"))
      return;
    deleteAccount(index);
  };

  const handleSetDefault = async (index) => {
    try {
      console.log("Setting default for account at index:", index);
      await setDefault(index); // Call the setDefault function from context
    } catch (error) {
      console.error("Error setting default account:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200">
      {/* Header */}
      <div className="flex items-center w-full bg-white  py-4 px-8 mb-6 border-b border-gray-200">
        <FaArrowLeft
          className="text-gray-700 text-2xl cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => window.history.back()}
        />
        <h1 className="ml-6 text-3xl font-extrabold text-gray-800">
          Bank Accounts
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-8">
          {/* Saved Bank Cards Section */}
          <div className="w-full lg:w-[60%] space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Bank Accounts
              </h2>
            </div>

            {accounts.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-8 text-center border border-gray-200">
                <div className="text-gray-500 mb-4">
                  No bank accounts added yet
                </div>
                <button
                  onClick={() => {
                    setBankDetails({
                      bankName: "",
                      accountNumber: "",
                      accountHolder: "",
                      branchCode: "",
                    });
                    setIsEditing(false);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg transition-opacity"
                >
                  <FaPlus /> Add Your First Account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account, index) => (
                  <div
                    key={account._id}
                    className={`bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 transition-all duration-200 transform hover:translate-x-2 hover:shadow-2xl ${
                      defaultAccount === index
                        ? "border-2 border-blue-500"
                        : "border border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {account.bankName}
                        </h3>
                        {defaultAccount === index && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                            Default Account
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-yellow-500 hover:text-yellow-600 transition-colors p-2"
                          title="Edit"
                        >
                          <FaPencilAlt className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-600 transition-colors p-2"
                          title="Delete"
                        >
                          <FaTrashAlt className="text-lg" />
                        </button>
                        {defaultAccount !== index && (
                          <button
                            onClick={() => handleSetDefault(index)}
                            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Account Number</p>
                        <p className="font-medium">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Account Holder</p>
                        <p className="font-medium">{account.accountHolder}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Branch Code</p>
                        <p className="font-medium">{account.branchCode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Section */}
          {(isEditing || accounts.length < 2) && (
            <div className="w-full lg:w-[35%]">
              <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {isEditing ? "Edit Bank Account" : "Add Bank Account"}
                </h2>

                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div>
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={bankDetails.bankName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bank name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter account number"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="accountHolder"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      id="accountHolder"
                      name="accountHolder"
                      value={bankDetails.accountHolder}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter account holder's name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="branchCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Branch Code
                    </label>
                    <input
                      type="text"
                      id="branchCode"
                      name="branchCode"
                      value={bankDetails.branchCode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter branch code"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditIndex(null);
                          setBankDetails({
                            bankName: "",
                            accountNumber: "",
                            accountHolder: "",
                            branchCode: "",
                          });
                        }}
                        className="px-4 py-2 text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
                    >
                      {isEditing ? (
                        "Save Changes"
                      ) : (
                        <>
                          <FaPlus />
                          <span>Add Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={loading} />
    </div>
  );
};

export default ReceiptInformation;
