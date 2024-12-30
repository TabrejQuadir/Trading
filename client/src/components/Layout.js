import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';  // Your Footer component

const Layout = ({ children }) => {
  const location = useLocation();

  // Check if the current route is '/currency/:symbol', '/login', or '/register'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isCurrencyDetailPage = location.pathname.startsWith('/currency/');
  const isRecieptInformationPage = location.pathname.startsWith('/receiptInformation');


  return (
    <div>
      {/* Your content */}
      {children}

      {/* Conditionally render Footer */}
      {/* Exclude footer on login, register, and currency detail pages */}
      {!isAuthPage && !isCurrencyDetailPage && !isRecieptInformationPage && <Footer />}
    </div>
  );
};

export default Layout;
