// context/BankAccountContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const BankAccountContext = createContext();

export const BankAccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [defaultAccount, setDefaultAccount] = useState(0);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

  // Fetch bank accounts when the component mounts
  useEffect(() => {
    fetchBankAccounts();
  }, [user?._id]);

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/bank-accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.accounts) {
        setAccounts(response.data.accounts);
        const defaultAcc = response.data.accounts.findIndex(
          (acc) => acc.isDefault
        );
        if (defaultAcc !== -1) {
          setDefaultAccount(defaultAcc);
        }
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (bankDetails) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/bank-accounts",
        bankDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBankAccounts(); // Refresh the list of bank accounts
    } catch (error) {
      console.error("Error adding bank account:", error);
    }
  };

  const editAccount = async (index, bankDetails) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/bank-accounts/${accounts[index]._id}`,
        bankDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBankAccounts(); // Refresh the list of bank accounts
    } catch (error) {
      console.error("Error editing bank account:", error);
    }
  };

  const deleteAccount = async (index) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/bank-accounts/${accounts[index]._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBankAccounts(); // Refresh the list of bank accounts
    } catch (error) {
      console.error("Error deleting bank account:", error);
    }
  };

  const setDefault = async (index) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing!");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/bank-accounts/${accounts[index]._id}/set-default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data); // Log the response

      setDefaultAccount(index); // Set the default account in the state
      await fetchBankAccounts(); // Refresh the list of bank accounts after state is updated
    } catch (error) {
      console.error("Error setting default account:", error);
    }
  };

  return (
    <BankAccountContext.Provider
      value={{
        accounts,
        defaultAccount,
        loading,
        addAccount,
        editAccount,
        deleteAccount,
        setDefault,
      }}
    >
      {children}
    </BankAccountContext.Provider>
  );
};

export default BankAccountContext;
