import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const SignupWithOTP = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const sendOTP = async () => {
    if (!form.email) {
      toast.error("Please enter your email first.");
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/sendotp",
        { email: form.email }
      );

      console.log(response);
      if (response.data.success) toast.success("Otp Sent successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          otp: form.otp,
        }
      );
      console.log(response);
      if (response.data.success === true) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.id);
        navigate("/");
      } else toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-900">
      <div className="h-[110vh] bg-gray-900 dark:bg-gray-900 flex items-center justify-center px-4">
        <Toaster position="top-center" />

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Create Account
          </h2>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              OTP
            </label>
            <div className="flex">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
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
            Create Account
          </button>

          <p className="text-center text-sm text-gray-700 dark:text-white mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupWithOTP;
