import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const RegisterSuperAdmin = () => {
  const { registerSuperAdmin } = useAuth();
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the role of superadmin to the data being sent
      await registerSuperAdmin({ ...adminData, role: "superadmin" });
      setSuccess("Superadmin registered successfully!");
      setError("");
    } catch (err) {
      // Check if the error response has a message and set it
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-500 to-blue-600 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96 md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Register Super Admin
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={adminData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={adminData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={adminData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Display the role as superadmin */}
          <div className="mt-4">
            <label className="block text-gray-700">Role:</label>
            <input
              type="text"
              value="superadmin"
              readOnly
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Register Super Admin
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/loginSuperAdmin"
              className="text-blue-600 hover:underline"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuperAdmin;