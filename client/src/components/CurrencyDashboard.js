import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";
import { cn } from "../lib/utils";
import { CurrencyContext } from "../context/CurrencyContext";

function CurrencyDashboard() {
  const { currencies } = useContext(CurrencyContext); // Use the context
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  // Load theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save the theme to localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle the theme between dark and light
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Calculate total market stats
  const totalVolume = currencies.reduce(
    (acc, curr) => acc + parseFloat(curr.price),
    0
  );
  const averageChange =
    currencies.reduce((acc, curr) => acc + parseFloat(curr.updown), 0) /
    (currencies.length || 1);
  const activePairs = currencies.length;

  let USDT = "USDT";

  const handleCurrencyClick = (symbolCode) => {
    navigate(`/currency/${symbolCode}${USDT}`);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col items-center",
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      )}
    >
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={cn(
            "p-3 rounded-full transition-all duration-300 shadow-lg",
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
              : "bg-white hover:bg-gray-100 border border-gray-200"
          )}
        >
          {theme === "dark" ? (
            <SunIcon className="w-6 h-6 text-yellow-400 animate-pulse" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-800 animate-pulse" />
          )}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Header Section with Animated Gradient */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-20 -z-10"></div>
          <h1
            className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            style={{ lineHeight: "1.5" }}
          >
            Currency Dashboard
          </h1>
          <p
            className={cn(
              "text-lg font-medium",
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            )}
          >
            Real-time market data updated every few seconds
          </p>
        </div>

        {/* Stats Overview with Glass Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Total Volume",
              value: `$${totalVolume.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}`,
              icon: "💰",
            },
            {
              title: "Active Pairs",
              value: activePairs,
              icon: "🔄",
            },
            {
              title: "Average Change",
              value: `${averageChange >= 0 ? "+" : ""}${averageChange.toFixed(
                2
              )}%`,
              color: averageChange >= 0 ? "text-green-400" : "text-red-400",
              icon: averageChange >= 0 ? "📈" : "📉",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-2xl backdrop-blur-md transform transition-all duration-300",
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/15 border border-white/10"
                  : "bg-white/70 hover:bg-white/90 border border-white/50",
                "shadow-lg hover:shadow-2xl group"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </span>
                <div>
                  <h3
                    className={cn(
                      "text-sm uppercase tracking-wider font-medium",
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    {stat.title}
                  </h3>
                  <p
                    className={cn(
                      "text-2xl font-bold mt-1",
                      stat.color ||
                        (theme === "dark" ? "text-white" : "text-gray-800")
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Currency Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currencies.map((currency) => (
            <div
              key={currency.symbolCode}
              className={cn(
                "rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105",
                "backdrop-blur-md group",
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/15 border border-white/10"
                  : "bg-white/70 hover:bg-white/90 border border-white/50",
                "shadow-lg hover:shadow-2xl"
              )}
              onClick={() =>
                handleCurrencyClick(currency.symbolCode.toUpperCase())
              }
            >
              {/* Currency Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full blur-md transition-all duration-300",
                        theme === "dark"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 group-hover:opacity-100"
                          : "bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 group-hover:opacity-75"
                      )}
                    ></div>
                    <img
                      src={currency.symbolIcon}
                      alt={currency.symbolDisplayName}
                      className="w-14 h-14 rounded-full relative z-10 transition-transform group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          "https://cryptologos.cc/logos/question-mark.png";
                      }}
                    />
                  </div>
                  <div>
                    <h2
                      className={cn(
                        "text-xl font-bold",
                        theme === "dark" ? "text-white" : "text-gray-800"
                      )}
                    >
                      {currency.symbolDisplayName}
                    </h2>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      {currency.symbolCode.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-3xl font-bold transition-colors",
                      parseFloat(currency.updown) >= 0
                        ? "text-green-400 group-hover:text-green-300"
                        : "text-red-400 group-hover:text-red-300"
                    )}
                  >
                    $
                    {parseFloat(currency.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </p>
                  <div
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      parseFloat(currency.updown) >= 0
                        ? "bg-green-500/20 text-green-400 group-hover:bg-green-500/30"
                        : "bg-red-500/20 text-red-400 group-hover:bg-red-500/30"
                    )}
                  >
                    {parseFloat(currency.updown) >= 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    <span>
                      {parseFloat(currency.updown) >= 0 ? "+" : ""}
                      {currency.updown}%
                    </span>
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
