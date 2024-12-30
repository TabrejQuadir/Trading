const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, country, invitationCode } = req.body;

    if (!email || !password || !country || !invitationCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate if the invitation code exists and belongs to a valid admin (superadmin or subadmin)
    const referringAdmin = await Admin.findOne({ invitationCode });

    if (!referringAdmin) {
      return res.status(400).json({ message: "Invalid invitation code" });
    }

    // Check if the admin is either a subadmin or superadmin
    if (!["superadmin", "subadmin"].includes(referringAdmin.role)) {
      return res.status(400).json({
        message:
          "Invitation code is invalid or does not belong to a valid admin",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and link them to the referring admin (subadmin or superadmin)
    const newUser = new User({
      email,
      password: hashedPassword,
      country,
      referredBy: referringAdmin._id, // Linking to the referring admin
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Registration error:", error); // Log the actual error
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a token
    const token = jwt.sign(
      {
        userId: user._id,
        userName: user.email,
        balance: user.balance,
        vipLevel: user.vipLevel,
        country: user.country,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return token and user object (excluding sensitive information like password)
    res.json({
      token,
      user: {
        id: user._id,
        userName: user.email,
        balance: user.balance,
        vipLevel: user.vipLevel,
        country: user.country,
        referredBy: user.referredBy, // Include additional fields if required
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User Logout
exports.logoutUser = (req, res) => {
  // Logic for logging out (e.g., invalidate token on client side)
  res.json({ message: "Logged out successfully" });
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Add Balance
exports.addBalance = async (req, res) => {
  console.log("Admin userId:", req.user._id);

  try {
    const { userId, amount } = req.body;

    // Validate inputs
    const parsedAmount = parseFloat(amount); // Convert amount to a number
    if (!userId || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid user ID or amount specified" });
    }

    // Ensure the current admin's ID and role are available from the request
    const adminId = req.user._id; // `req.user` is populated by adminAuth middleware
    const adminRole = req.user.role;

    // Find the user by ID
    let user;
    if (adminRole === "superadmin") {
      // Superadmin can add balance to any user
      user = await User.findById(userId);
    } else if (adminRole === "subadmin") {
      // Subadmin can only add balance to users they referred
      user = await User.findOne({ _id: userId, referredBy: adminId });
    }

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not referred by this admin" });
    }

    // Update the user's balance
    user.balance += parsedAmount;
    await user.save();

    res.json({
      message: "Balance added successfully",
      user: {
        id: user._id,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error("Error adding balance:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Deduct Balance
exports.deductBalance = async (req, res) => {
  console.log("Admin userId:", req.user._id);

  try {
    const { userId, amount } = req.body;

    // Validate inputs
    const parsedAmount = parseFloat(amount); // Convert amount to a number
    if (!userId || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid user ID or amount specified" });
    }

    // Ensure the current admin's ID and role are available from the request
    const adminId = req.user._id; // `req.user` is populated by adminAuth middleware
    const adminRole = req.user.role;

    // Find the user by ID
    let user;
    if (adminRole === "superadmin") {
      // Superadmin can add balance to any user
      user = await User.findById(userId);
    } else if (adminRole === "subadmin") {
      // Subadmin can only add balance to users they referred
      user = await User.findOne({ _id: userId, referredBy: adminId });
    }

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not referred by this admin" });
    }

    // Update the user's balance
    user.balance -= parsedAmount;
    await user.save();

    res.json({
      message: "Balance deducted successfully",
      user: {
        id: user._id,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error("Error adding balance:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Balance Frozen
exports.updateBalanceFrozen = async (req, res) => {
  console.log("Admin userId:", req.user._id);

  try {
    const { userId, isFrozen } = req.body;

    // Validate inputs
    if (!userId || typeof isFrozen !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid user ID or frozen status specified" });
    }

    // Ensure the current admin's ID and role are available from the request
    const adminId = req.user._id; // `req.user` is populated by adminAuth middleware
    const adminRole = req.user.role;

    // Find the user by ID
    let user;
    if (adminRole === "superadmin") {
      // Superadmin can update balance frozen status for any user
      user = await User.findById(userId);
    } else if (adminRole === "subadmin") {
      // Subadmin can only update balance frozen status for users they referred
      user = await User.findOne({ _id: userId, referredBy: adminId });
    }

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not referred by this admin" });
    }

    // Update the user's balance frozen status
    user.isBalanceFrozen = isFrozen;
    await user.save();

    res.json({
      message: "Balance frozen status updated successfully",
      user: {
        id: user._id,
        email: user.email,
        isBalanceFrozen: user.isBalanceFrozen,
      },
    });
  } catch (error) {
    console.error("Error updating balance frozen status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Add Reputation
exports.addReputation = async (req, res) => {
  console.log("Admin userId:", req.user._id);

  try {
    const { userId, points } = req.body;

    // Validate inputs
    const parsedAmount = parseFloat(points); // Convert amount to a number
    if (!userId || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid user ID or amount specified" });
    }

    // Ensure the current admin's ID and role are available from the request
    const adminId = req.user._id; // `req.user` is populated by adminAuth middleware
    const adminRole = req.user.role;

    // Find the user by ID
    let user;
    if (adminRole === "superadmin") {
      // Superadmin can add balance to any user
      user = await User.findById(userId);
    } else if (adminRole === "subadmin") {
      // Subadmin can only add balance to users they referred
      user = await User.findOne({ _id: userId, referredBy: adminId });
    }

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not referred by this admin" });
    }

    // Update the user's balance
    user.reputationPoints += parsedAmount;
    await user.save();

    res.json({
      message: "ReputationPoints added successfully",
      user: {
        id: user._id,
        email: user.email,
        reputationPoints: user.reputationPoints,
      },
    });
  } catch (error) {
    console.error("Error adding ReputationPoints:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Deduct Reputation
exports.deductReputation = async (req, res) => {
  console.log("Admin userId:", req.user._id);

  try {
    const { userId, points } = req.body;

    // Validate inputs
    const parsedAmount = parseFloat(points); // Convert amount to a number
    if (!userId || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid user ID or amount specified" });
    }

    // Ensure the current admin's ID and role are available from the request
    const adminId = req.user._id; // `req.user` is populated by adminAuth middleware
    const adminRole = req.user.role;

    // Find the user by ID
    let user;
    if (adminRole === "superadmin") {
      // Superadmin can add balance to any user
      user = await User.findById(userId);
    } else if (adminRole === "subadmin") {
      // Subadmin can only add balance to users they referred
      user = await User.findOne({ _id: userId, referredBy: adminId });
    }

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not referred by this admin" });
    }

    // Update the user's balance
    user.reputationPoints -= parsedAmount;
    await user.save();

    res.json({
      message: "ReputationPoints deducted successfully",
      user: {
        id: user._id,
        email: user.email,
        reputationPoints: user.reputationPoints,
      },
    });
  } catch (error) {
    console.error("Error adding reputationPoints:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update isGonnaWin
exports.isGonnaWin = async (req, res) => {
  console.log("Admin userId:", req.user._id);

  try {
    const { userId, isGonnaWin } = req.body;

    console.log("isGonnaWin:", isGonnaWin);
    console.log("userId:", userId);

    // Validate inputs
    if (!userId || typeof isGonnaWin !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid user ID or isGonnaWin flag specified" });
    }

    // Ensure the current admin's ID and role are available from the request
    const adminId = req.user._id; // `req.user` is populated by adminAuth middleware
    const adminRole = req.user.role;

    // Find the user by ID
    let user;
    if (adminRole === "superadmin") {
      // Superadmin can add balance to any user
      user = await User.findById(userId);
    } else if (adminRole === "subadmin") {
      // Subadmin can only add balance to users they referred
      user = await User.findOne({ _id: userId, referredBy: adminId });
    }
    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not referred by this admin" });
    }

    // Update the user's isGonnaWin flag
    user.isGonnaWin = isGonnaWin;
    await user.save();

    res.json({
      message: "isGonnaWin flag updated successfully",
      user: {
        id: user._id,
        email: user.email,
        isGonnaWin: user.isGonnaWin,
      },
    });
  } catch (error) {
    console.error("Error updating isGonnaWin flag:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
