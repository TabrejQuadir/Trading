import React, { useState, useContext } from 'react';
import { FaGlobe, FaHeadset } from 'react-icons/fa'; // Importing the icons
import { Link, useNavigate } from 'react-router-dom'; // Importing Link for navigation
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext); // Get login function from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password); // Call login function from context
    console.log('Login success:', success); // Debugging log
    if (success) { // Check if login was successful
      console.log('Redirecting to dashboard...'); // Debugging log
      navigate('/'); // Redirect to dashboard after successful login
    } else {
      // Optionally handle login failure (e.g., show an error message)
      console.error('Login failed');
    }
  };

  return (
    <div className=" p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        {/* Language Icon */}
        <FaGlobe size={24} className="text-gray-500" />
        {/* Customer Care Icon */}
        <FaHeadset size={24} className="text-gray-500" />
      </div>

      <div className='flex justify-center'>
        <img src='loogo.png' className='size-16' />
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Login
        </button>

        {/* Forgot password link */}
        <p className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot your password?
          </Link>
        </p>

        {/* Sign Up Link */}
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
