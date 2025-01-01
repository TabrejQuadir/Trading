import React, { useState, useContext } from 'react';
import { FaGlobe, FaGoogle, FaLock, FaLockOpen, FaRegClipboard, FaHeadset } from 'react-icons/fa'; // Importing the necessary icons
import { Link, useNavigate } from 'react-router-dom'; // Importing Link for navigation
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    invitationCode: '',
  });

  const { register } = useContext(AuthContext); // Get register function from context
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
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
  
    try {
      console.log(formData, "formdata")
      // Call the register function from context and await the response
      const response = await register(formData);
  
      // Check if the registration was successful
      if (response && response.status === 201) {
        alert('Registration successful! You can now log in.');
        navigate('/login');
      } else {
        // Show the error message returned from backend (including invitation code expired)
        alert(response?.data?.message || 'Registration failed');
      }
    } catch (error) {
      // Handle errors from the register function or API request
      console.error('Registration error:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };
  
  

  const countries = [
    'India',
    'Pakistan',
    'Russia',
  ]

  return (
    <div className="p-8">
      {/* Header section with language and customer care icons */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        {/* Language Icon on the left */}
        <div className="flex items-center">
          <FaGlobe size={24} className="text-gray-500 mr-2" />
        </div>
        
        {/* Customer Care Icon on the right */}
        <div className="flex items-center">
          <FaHeadset size={24} className="text-gray-500 mr-2" />
        </div>
      </div>

      <div className='flex justify-center'>
      <img src='loogo.png' className='size-16'/>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {/* Country Selection */}
        <div>
          <label htmlFor="country" className="block text-sm font-semibold">
            Country of Origin
          </label>
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FaGlobe size={20} className="mr-2 text-gray-500" />
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              required
            >
              <option value="" disabled>Select your country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Email (Register with Gmail) */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FaGoogle size={20} className="mr-2 text-gray-500" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              placeholder="example@gmail.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FaLock size={20} className="mr-2 text-gray-500" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold">
            Confirm Password
          </label>
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FaLockOpen size={20} className="mr-2 text-gray-500" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              required
            />
          </div>
        </div>

        {/* Invitation Code */}
        <div>
          <label htmlFor="invitationCode" className="block text-sm font-semibold">
            Invitation Code
          </label>
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FaRegClipboard size={20} className="mr-2 text-gray-500" />
            <input
              type="text"
              id="invitationCode"
              name="invitationCode"
              value={formData.invitationCode}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              placeholder="Enter invitation code"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Register
        </button>
        
        {/* Sign In Link */}
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
