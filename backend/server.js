require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const currencyRoutes = require('./routes/currencyRoutes');
const authRoutes = require('./routes/authRoutes');
// const invitationRoutes = require('./routes/invitationRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Adjust the path as needed
const bankAccountRoutes = require('./routes/bankAccountRoutes'); // Add bank account routes
const adminRoutes = require('./routes/adminRoutes');
const withdrawalRoutes = require('./routes/withdrawal');
const Currency = require('./models/currencySchema');

const app = express();

// CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Allow both client and admin origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected successfully');

    // Insert predefined currencies
    // const currencies = [
    //   { symbolCode: 'BTC', symbolDisplayName: 'Bitcoin', symbolIcon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', price: 97555, updown: 2.5, pointMin: 48000, pointMax: 52000 },
    //   { symbolCode: 'ETH', symbolDisplayName: 'Ethereum', symbolIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', price: 4000, updown: -1.2, pointMin: 3900, pointMax: 4100 },
    //   { symbolCode: 'ADA', symbolDisplayName: 'Cardano', symbolIcon: 'https://cryptologos.cc/logos/cardano-ada-logo.png', price: 2.05, updown: -0.5, pointMin: 2.10, pointMax: 2.20 },
    //   { symbolCode: 'SOL', symbolDisplayName: 'Solana', symbolIcon: 'https://cryptologos.cc/logos/solana-sol-logo.png', price: 200, updown: 3.1, pointMin: 205, pointMax: 195 },
    //   { symbolCode: 'XRP', symbolDisplayName: 'Ripple', symbolIcon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', price: 2.05, updown: 0.7, pointMin: 2.40, pointMax: 1.80 },
    //   { symbolCode: 'LTC', symbolDisplayName: 'Litecoin', symbolIcon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', price: 180, updown: -2.0, pointMin: 175, pointMax: 185 },
    //   { symbolCode: 'BNB', symbolDisplayName: 'Binance Coin', symbolIcon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', price: 450, updown: 1.3, pointMin: 440, pointMax: 460 },
    //   { symbolCode: 'DOT', symbolDisplayName: 'Polkadot', symbolIcon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', price: 35, updown: 0.4, pointMin: 34, pointMax: 36 },
    //   { symbolCode: 'UNI', symbolDisplayName: 'Uniswap', symbolIcon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', price: 25, updown: -1.5, pointMin: 24, pointMax: 26 },
    //   { symbolCode: 'LINK', symbolDisplayName: 'Chainlink', symbolIcon: 'https://cryptologos.cc/logos/chainlink-link-logo.png', price: 30, updown: 1.8, pointMin: 29, pointMax: 31 }
    // ];

    // try {
    //   await Currency.insertMany(currencies);
    //   console.log('Currencies inserted successfully');
    // } catch (error) {
    //   console.error('Error inserting currencies:', error);
    // }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/currencies', currencyRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/invitation-codes', invitationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bank-accounts', bankAccountRoutes); // Add bank account routes
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin', adminRoutes); // Add admin routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
