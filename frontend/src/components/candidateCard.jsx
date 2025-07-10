import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateCard = ({ candidate, pollId, expiryDate }) => {
  const {
    candidateName,
    description,
    votes: initialVotes,
    candidateId,
    candidateImageUrl,
  } = candidate;

  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [votes, setVotes] = useState(initialVotes);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const token = localStorage.getItem("token");

  const isExpired = new Date(expiryDate) < new Date();

  const handleVote = async () => {
    try {
      if (!userId || !pollId) {
        toast.error("Missing user or poll ID");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/v2/allowedtovote/${userId}`,
        { pollId },
        { headers: { authorization: `${token}` } }
      );

      if (response.data.loginStatus === 0) {
        toast.error("Login first");
        navigate("/login");
      }

      const { allowedToVote, message } = response.data;
      toast.dismiss();
      if (allowedToVote) {
        setShowOtpInput(true);
        await axios.post("http://localhost:8000/api/v1/sendotp", { token });
        toast.success("Otp sent successfully!");
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error checking voting permission:", error);
      toast.error("Something went wrong");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      if (!otp.trim()) {
        toast.error("Please enter OTP");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/v2/castvote/${userId}`,
        { pollId, otp, candidateId: candidate.candidateId },
        { headers: { authorization: `${token}` } }
      );

      if (response.data.loginStatus === 0) {
        toast.error("Login first");
        navigate("/login");
      }

      toast.success(response.data.message);
      setVotes(response.data.votes);
      setShowOtpInput(false);
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed");
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-200
      rounded-3xl h-[50vh] shadow-lg hover:shadow-2xl transition-shadow duration-300
      w-80 p-5 flex flex-col items-center text-center relative border border-indigo-300"
    >
      <Toaster position="top-center" />
      <img
        src={candidateImageUrl}
        alt={candidateName}
        className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 mb-4 shadow-md"
      />
      <h2 className="text-2xl font-semibold text-indigo-800 mb-1">
        {candidateName}
      </h2>
      <p className="text-sm text-gray-700 mb-3 italic">{description}</p>
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
        <span className="text-xl font-medium">Votes:</span>
        <span className="font-bold text-2xl text-indigo-800">{votes}</span>
      </div>

      {!isExpired && (
        <button
          onClick={handleVote}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
            rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow"
        >
          Cast Vote
        </button>
      )}

      {isExpired && (
        <span className="block mt-2 text-sm font-medium text-red-600 bg-red-100 p-2 rounded-lg shadow-sm">
          This poll has expired
        </span>
      )}

      {showOtpInput && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl p-6 rounded-xl z-50 w-80 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-center text-indigo-700">
            Enter OTP
          </h3>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter OTP"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setShowOtpInput(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleOtpSubmit}
              className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
