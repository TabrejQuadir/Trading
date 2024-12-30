import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CurrencyDashboard from './components/CurrencyDashboard';
import CurrencyDetail from './pages/CurrencyDetail';
import Layout from './components/Layout';
import OrderRecord from './pages/OrderRecord';
import Register from './pages/Register';
import Login from './pages/Login';
import WithdrawalRecord from './pages/WithdrawalRecord';
import Withdrawls from './pages/WithdrawalPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import ReceiptInformation from './pages/ReceiptInformation';
import AboutUs from './pages/AboutUs';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<CurrencyDashboard />} />

          {/* Authentication Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutUs" element={<AboutUs />} />

          {/* Protected Routes */}
          <Route
            path="/currency/:symbol"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CurrencyDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orderRecord"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <OrderRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdrawalRecord"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WithdrawalRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiptInformation"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ReceiptInformation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdrawls"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Withdrawls />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
