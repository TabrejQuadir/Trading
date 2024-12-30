import React from 'react';
import { FaTrophy, FaUsers, FaRocket, FaMobileAlt } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-purple-700 to-indigo-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
            Welcome to <span className="text-yellow-400">BetSphere</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl">
            Experience the thrill of betting with the most trusted platform. Your game, your win, your way!
          </p>
        </div>
      </header>

      {/* About Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Why Choose <span className="text-yellow-400">BetSphere?</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                At BetSphere, we bring a world-class betting experience right to your fingertips. Whether you're a sports fanatic or a casino enthusiast, we’ve got you covered with unmatched odds, exciting features, and a secure platform.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <FaTrophy className="text-yellow-400 text-2xl" />
                  <p className="text-gray-300">
                    <strong>Top-notch Betting:</strong> Offering premium betting opportunities across sports, casinos, and live games.
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <FaUsers className="text-yellow-400 text-2xl" />
                  <p className="text-gray-300">
                    <strong>Community of Winners:</strong> Join a community of passionate bettors making informed decisions.
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <FaRocket className="text-yellow-400 text-2xl" />
                  <p className="text-gray-300">
                    <strong>Fast and Reliable:</strong> With lightning-fast payouts and seamless user experience.
                  </p>
                </li>
              </ul>
            </div>
            {/* Image */}
            <div className='size-full'>
              <img
                src="https://img.freepik.com/premium-psd/money-coins-bag-3d-illustration_572799-662.jpg"
                alt="Betting Excitement"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-10">
            <span className="text-yellow-400">Features</span> You’ll Love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Cards */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
              <FaMobileAlt className="text-yellow-400 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mobile Betting</h3>
              <p className="text-gray-400">
                Bet on the go with our user-friendly mobile app. Never miss a game!
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
              <FaTrophy className="text-yellow-400 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Odds</h3>
              <p className="text-gray-400">
                Enjoy competitive odds and maximize your winnings.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
              <FaRocket className="text-yellow-400 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Payouts</h3>
              <p className="text-gray-400">
                Get your winnings quickly and without hassle.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
              <FaUsers className="text-yellow-400 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Our support team is always here to help, anytime you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-10">
            Join BetSphere today and enjoy a seamless, exciting betting experience. It's time to make every bet count!
          </p>
          <button className="bg-black text-yellow-400 px-6 py-3 mb-6 rounded-lg text-lg font-medium hover:bg-gray-800 transition-transform transform hover:scale-105">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
