const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
const User = require("../models/UserSchema");

// Helper function to generate a random invitation code
const generateInvitationCode = () => {
  return Math.random().toString(36).substr(2, 8); // Generate a random 8-character string
};

// Register Admin (Superadmin)
exports.registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Check if a superadmin already exists
    if (role === "superadmin") {
      const existingSuperAdmin = await Admin.findOne({ role: "superadmin" });
      if (existingSuperAdmin) {
        return res.status(400).json({ message: "Only one superadmin can be created" });
      }
    }

    // Hash password for superadmin
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
      invitationCode: role === "superadmin" ? generateInvitationCode() : null, // Generate invitation code for superadmin only
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Admin registered successfully", newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.registerSubAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Extract the superadmin's ID from the authenticated user (e.g., req.user.id)
    const superAdminId = req.user.id;
    console.log("Superadmin ID:", superAdminId);

    // Verify if the authenticated user is a superadmin
    const superAdmin = await Admin.findOne({ _id: superAdminId, role: "superadmin" });
    if (!superAdmin) {
      return res.status(403).json({ message: "Unauthorized: Only superadmins can create subadmins" });
    }

    // Check if the subadmin already exists
    const existingSubAdmin = await Admin.findOne({ email });
    if (existingSubAdmin) {
      return res.status(400).json({ message: "Sub-admin already exists" });
    }

    // Hash the password for the subadmin
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate an invitation code for the new subadmin
    const newInvitationCode = generateInvitationCode();

    // Create the new sub-admin
    const newSubAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "subadmin",
      createdBy: superAdmin._id, // Link sub-admin to the superadmin
      invitationCode: newInvitationCode, // Assign invitation code
    });

    // Save the sub-admin and respond
    await newSubAdmin.save();
    res.status(201).json({
      message: "Sub-admin registered successfully",
      newSubAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get All Sub-Admins (only accessible to superadmin)
exports.getSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Admin.find({ role: "subadmin" }).select(
      "-password"
    );
    res.json(subAdmins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch all sub-admins
exports.getAllSubAdmins = async (req, res) => {
  try {
    // Check if the requester is a super admin
    if (req.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only super admins can view sub-admins.",
      });
    }

    // Fetch all sub-admins
    const subAdmins = await Admin.find({ role: "subadmin" }).select(
      "-password"
    ); // Exclude password for security

    if (subAdmins.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No sub-admins found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub-admins fetched successfully.",
      data: subAdmins,
    });
  } catch (error) {
    console.error("Error fetching sub-admins:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching sub-admins.",
      error: error.message,
    });
  }
};


// Delete a sub-admin
exports.deleteSubAdmin = async (req, res) => {
  try {
    // Check if the requester is a super admin
    if (req.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only super admins can delete sub-admins.",
      });
    }

    // Get the sub-admin ID from the request parameters
    const subAdminId = req.params.id;

    // Check if the sub-admin exists
    const subAdmin = await Admin.findOne({ _id: subAdminId, role: "subadmin" });
    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub-admin not found.",
      });
    }

    // Delete the sub-admin
    await Admin.deleteOne({ _id: subAdminId });

    return res.status(200).json({
      success: true,
      message: "Sub-admin deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting sub-admin:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the sub-admin.",
      error: error.message,
    });
  }
};


// Login Admin (for both superadmins and subadmins)
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and assign token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role, invitationCode: admin.invitationCode },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Users Registered by a Specific Sub-Admin
exports.getUsersBySubAdmin = async (req, res) => {
  const { userId, role } = req;
  console.log("userId:", userId, "role:", role); // Assuming `req.user` contains the logged-in user's info

  if (role === "subadmin") {
    try {
      const referredUsers = await User.find({ referredBy: userId });
      return res.json({
        success: true,
        data: referredUsers,
        message: "Fetched referred users successfully",
      });
    } catch (error) {
      console.error("Error fetching referred users:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch referred users." });
    }
  }

  if (role === "superadmin") {
    try {
      // Fetch all users if the role is superadmin
      const allUsers = await User.find();
      return res.json(allUsers);
    } catch (error) {
      console.error("Error fetching all users:", error);
      return res.status(500).json({ message: "Failed to fetch all users." });
    }
  }

  // Default response for unauthorized access
  return res.status(403).json({ message: "Access denied" });
};

// Get All Users Registered by All Sub-Admins (SuperAdmin Only)
exports.getAllUsers = async (req, res) => {
  const { role } = req;

  // Check if the user is a superadmin
  if (role !== "superadmin") {
    return res
      .status(403)
      .json({
        message: "Access denied. Only superadmin can access this resource.",
      });
  }

  try {
    // Fetch all users from the User model
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching all users", error });
  }
};


