import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils';

function CurrencyDashboard() {
  const [currencies, setCurrencies] = useState([]);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('https://trading-backendd.onrender.com');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('currencyUpdate', (data) => {
      setCurrencies(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Calculate total market stats
  const totalVolume = currencies.reduce((acc, curr) => acc + parseFloat(curr.price), 0);
  const averageChange = currencies.reduce((acc, curr) => acc + parseFloat(curr.updown), 0) / (currencies.length || 1);
  const activePairs = currencies.length;

  const handleCurrencyClick = (symbolCode) => {
    navigate(`/currency/${symbolCode}`);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col items-center",
        theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      )}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className={cn(
              "text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent",
              "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md"
            )}
          >
            Live Currency Dashboard
          </h1>
          <p
            className={cn(
              "text-lg",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            )}
          >
            Real-time market data updated every few seconds
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Volume', value: `$${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
            { title: 'Active Pairs', value: activePairs },
            {
              title: 'Average Change',
              value: `${averageChange >= 0 ? '+' : ''}${averageChange.toFixed(2)}%`,
              color: averageChange >= 0 ? 'text-green-400' : 'text-red-400',
            },
            { title: 'Point Range', value: '0.01 - 2.00' },
          ].map((stat, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-xl backdrop-blur-md transform transition-all duration-300",
                theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/80 hover:bg-gray-100',
                "border border-gray-200/20 shadow-lg hover:shadow-2xl"
              )}
            >
              <h3 className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{stat.title}</h3>
              <p className={cn(
                "text-2xl font-bold",
                stat.color || (theme === 'dark' ? 'text-white' : 'text-gray-800')
              )}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currencies.map((currency) => (
            <div
              key={currency.symbolCode}
              className={cn(
                "rounded-xl p-6 cursor-pointer transition-transform transform",
                "backdrop-blur-md hover:scale-105 shadow-lg hover:shadow-2xl",
                theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/80 hover:bg-gray-100',
                "border border-gray-200/20"
              )}
              onClick={() => handleCurrencyClick(currency.symbolCode.toUpperCase())}
            >
              {/* Currency Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md"></div>
                    <img
                      src={currency.symbolIcon}
                      alt={currency.symbolDisplayName}
                      className="w-12 h-12 rounded-full relative z-10"
                      onError={(e) => {
                        e.target.src = 'https://cryptologos.cc/logos/question-mark.png';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className={cn(
                      "text-lg font-bold",
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    )}>
                      {currency.symbolDisplayName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {currency.symbolCode.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-3xl font-bold",
                    parseFloat(currency.updown) >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    ${parseFloat(currency.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </p>
                  <div className={cn(
                    "flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium",
                    parseFloat(currency.updown) >= 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  )}>
                    {parseFloat(currency.updown) >= 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    <span>{parseFloat(currency.updown) >= 0 ? '+' : ''}{currency.updown}%</span>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className={cn(
                  "grid grid-cols-2 gap-4 pt-3 mt-3",
                  "border-t",
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                )}>
                  <div>
                    <p className="text-xs text-gray-500">Point Min</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                      {currency.pointMin}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Point Max</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                      {currency.pointMax}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurrencyDashboard;
