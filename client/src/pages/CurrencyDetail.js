import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CurrencyChart from '../components/CurrencyChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { CurrencyContext } from '../context/CurrencyContext';
import OrderContext from '../context/OrderContext';
import '../index.css';
import BuyModal from '../components/BuyModal';

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
];

function CurrencyDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { currencies } = useContext(CurrencyContext);
  const {userOrders, setUserOrders} = useContext(OrderContext);
  const [interval, setInterval] = useState('1h');
  const [high, setHigh] = useState(null);
  const [low, setLow] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [averageChange, setAverageChange] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [tradeType, setTradeType] = useState('');

  useEffect(() => {
    const baseSymbol = symbol.slice(0, 3);
    const selectedCurrency = currencies.find(
      (currency) => currency.symbolCode.toLowerCase() === baseSymbol.toLowerCase()
    );

    if (selectedCurrency) {
      setCurrentCurrency(selectedCurrency);
      setAverageChange(selectedCurrency.updown);
    } else {
      console.error(`Currency with symbol ${baseSymbol} not found`);
    }

    const fetchMarketData = async () => {
      try {
        const formattedSymbol = `${symbol.toUpperCase()}`;
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${formattedSymbol}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setHigh(data.highPrice);
        setLow(data.lowPrice);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };
    fetchMarketData();
  }, [symbol, currencies]);

  const handleTradeClick = (type) => {
    setTradeType(type);
    setShowModal(true);
  };

  const handleOrderCreated = (newOrder) => {
    setUserOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-2 px-4 border-b">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="size-6" />
          </button>
          <h1 className="text-2xl font-bold tracking-wide">{symbol.toUpperCase()}</h1>
          <button
            onClick={() => navigate('/orderRecord')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-base font-semibold">Order History</span>
            <FontAwesomeIcon icon={faArrowRight} className="size-4" />
          </button>
        </div>

        {/* Current Price, Average Change, 24h High, and 24h Low */}
        <div className="flex justify-between items-center border-b p-4 pb-10 ">
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
              <h2 className="text-sm font-semibold text-white">Current Price:</h2>
              {currentCurrency ? (
                <p className="text-sm font-bold text-blue-400">
                  ${currentCurrency.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              ) : (
                <p className="text-red-500">Currency not found</p>
              )}
            </div>
            <div className='flex gap-2 items-center'>
              <h2 className="text-sm font-semibold text-white">Average Change:</h2>
              {currentCurrency && (
                <p
                  className={`text-sm font-bold ${averageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {averageChange >= 0 ? '+' : ''}
                  {averageChange.toFixed(2)}%
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
              <h2 className="text-sm font-semibold text-white">24-Hour High:</h2>
              <p className="text-sm font-bold text-gray-200">
                {high !== null && !isNaN(high) ? parseFloat(high).toFixed(2) : 'Loading...'}
              </p>
            </div>
            <div className='flex gap-3 items-center'>
              <h2 className="text-sm font-semibold text-white">24-Hour Low:</h2>
              <p className="text-sm font-bold text-gray-200">
                {low !== null && !isNaN(low) ? parseFloat(low).toFixed(2) : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex w-full space-x-4 sm:space-x-4 md:space-x-6 lg:space-x-10 bg-black">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setInterval(tf.value)}
              className={`px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-2 text-lg transition-transform transform ${interval === tf.value
                ? 'border-b-4 border-blue-600 text-white shadow-lg scale-105'
                : 'hover:border-b-2 hover:border-blue-400 text-gray-300'
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-lg shadow-xl backdrop-blur-md mb-4">
          <CurrencyChart symbol={symbol} interval={interval} high={high} low={low} />
        </div>

        {/* Buy Up and Buy Down Buttons */}
        <div className="flex  justify-center space-x-2 mb-1 px-4">
          <button
            onClick={() => handleTradeClick('Buy Up')}
            className="w-[50%] py-1 rounded-full text-lg font-semibold bg-green-500 text-white shadow-lg hover:bg-green-700 transition-transform transform"
          >
            Buy Up
          </button>
          <button
            onClick={() => handleTradeClick('Buy Down')}
            className="w-[50%] py-1 rounded-full text-lg font-semibold bg-red-600 text-white shadow-lg hover:bg-red-700 transition-transform transform"
          >
            Buy Down
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <BuyModal
            type={tradeType}
            symbol={symbol}
            onClose={() => setShowModal(false)}
            currentCurrency={currentCurrency}
            onOrderCreated={handleOrderCreated}
          />
        )}
      </div>
    </div>
  );
}

export default CurrencyDetail;
