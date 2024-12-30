import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { BankAccountProvider } from './context/BankAccountContext';  // Import the BankAccountProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <OrderProvider>
      <CurrencyProvider>
        <BankAccountProvider>  {/* Wrap App in BankAccountProvider */}
          <App />
        </BankAccountProvider>
      </CurrencyProvider>
    </OrderProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
