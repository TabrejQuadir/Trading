import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('https://trading-backendd.onrender.com/api/currencies');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCurrencies(data);
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
      }
    };

    fetchCurrencies();

    const interval = setInterval(fetchCurrencies, 3000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <CurrencyContext.Provider value={{ currencies, setCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};
