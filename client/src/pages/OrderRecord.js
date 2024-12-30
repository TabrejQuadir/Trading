import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import OrderContext from '../context/OrderContext';
import OrderDetail from '../components/OrderDetail';

const OrderRecord = () => {
  const [activeTab, setActiveTab] = useState('orders'); 
  const { userOrders, getUserOrders } = useContext(OrderContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchUserOrders = async () => {
    if (!user?._id) {
      console.log('No user ID available:', user);
      return;
    }
    try {
      setLoading(true);
      console.log('Fetching orders for user ID:', user._id);
      await getUserOrders(user._id);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('User state changed:', user);
    
    if (!user?._id) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchUserOrders();

    // Set up polling
    const intervalId = setInterval(() => {
      console.log('Polling orders...');
      fetchUserOrders();
    }, 15000);

    // Cleanup
    return () => {
      console.log('Cleaning up interval');
      clearInterval(intervalId);
    };
  }, [user]);

  const filteredOrders = userOrders?.filter((order) =>
    activeTab === 'orders' ? order.status === 'open' : order.status === 'closeout'
  );

  return (
    <div className="py-8 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Record</h1>

      <div className="flex border-b-2 mb-4">
        <button
          className={`flex-1 py-2 text-center text-lg font-semibold border border-gray-300 rounded-tl-lg ${
            activeTab === 'orders' ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => handleTabClick('orders')}
        >
          Positioned Orders
        </button>

        <button
          className={`flex-1 py-2 text-center text-lg font-semibold border border-gray-300 rounded-tr-lg ${
            activeTab === 'closeout' ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => handleTabClick('closeout')}
        >
          Closeout Orders
        </button>
      </div>

      <div>
        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredOrders?.length ? (
          filteredOrders.map((order, index) => (
            <OrderDetail 
              key={order._id || index} 
              order={order} 
            />
          ))
        ) : (
          <p className="text-center text-gray-600">No orders available in this category.</p>
        )}
      </div>

      <p className="flex justify-center text-gray-400 text-sm mb-20">-- There is no more --</p>
    </div>
  );
};

export default OrderRecord;
