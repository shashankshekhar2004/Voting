import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import img from "../assets/images.jpg";

const LogInWithOTP = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
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
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        email: form.email,
        password: form.password,
        otp: form.otp,
      });
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
    <div className="h-screen w-screen flex bg-gray-900">
      <div className="hidden md:flex w-1/2 relative">
        <img
          src={img}
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <p className="text-sm text-gray-300 mt-2">Hello!</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative">
        <Toaster position="top-center" />

        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl text-white">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          <div className="mb-4">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg outline-none text-sm text-white placeholder-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg outline-none text-sm text-white placeholder-gray-300"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium">OTP</label>
            <div className="flex mt-1">
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-l-lg outline-none text-sm text-white placeholder-gray-300"
              />
              <button
                onClick={sendOTP}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-semibold rounded-r-lg transition"
              >
                Send OTP
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white text-sm font-semibold transition"
          >
            Log In
          </button>

          <p className="text-center text-sm text-gray-300 mt-5">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInWithOTP;
