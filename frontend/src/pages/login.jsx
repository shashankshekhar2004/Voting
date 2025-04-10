import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import toast, { Toaster } from 'react-hot-toast';

const LogInWithOTP = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOTP = () => {
    if (form.email) {
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } else {
      toast.error('Please enter your email first.');
    }
  };

  const handleSubmit = () => {
    if (form.otp === '123456') {
      toast.success('Logged in successfully!');
    } else {
      toast.error('Invalid OTP. Try again.');
    }
  };

  return (
    <div className="bg-gray-900">
      <div className="h-[100vh] bg-gray-900 flex items-center justify-center px-4">
        <Toaster position="top-center" />

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Log In
          </h2>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">OTP</label>
            <div className="flex">
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="flex-1 px-3 py-1.5 border rounded-l text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={sendOTP}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-r hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 rounded text-sm font-semibold hover:bg-green-700"
          >
            Log In
          </button>

          {/* Link to Sign Up */}
          <p className="text-center text-sm text-gray-700 dark:text-white mt-4">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInWithOTP;
