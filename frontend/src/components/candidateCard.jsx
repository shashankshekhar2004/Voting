import React, { useState } from 'react'
import person from '../assets/person.jpeg'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

const CandidateCard = ({ candidate, pollId }) => {
  const {
    candidateName,
    description,
    votes: initialVotes,
    candidateId,
    candiadateImageUrl
  } = candidate
  const userId = localStorage.getItem("id");

  const [votes, setVotes] = useState(initialVotes)
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  const handleVote = async () => {
    try {
      if (!userId || !pollId) {
        toast.error("Missing user or poll ID");
        return;
      }


      const response = await axios.post(
        `http://localhost:8000/api/v2/allowedtovote/${userId}`,
        { pollId }
      );


      const { allowedToVote, message } = response.data;
      console.log(allowedToVote, message);
      const email = localStorage.getItem("email");
      if (allowedToVote) {
        setShowOtpInput(true); 
        const response = await axios.post(
          "http://localhost:8000/api/v1/sendotp",
          { email: email }
        );

        toast.success("Otp sent successfully!");

      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error checking voting permission:", error);
      toast.error("Something went wrong");
    }
  }

  const handleOtpSubmit = async () => {
    try {
      if (!otp.trim()) {
        toast.error("Please enter OTP");
        return;
      }
      const response = await axios.post(
        `http://localhost:8000/api/v2/castvote/${userId}`,
        { pollId:pollId,otp:otp,candidateId: candidate.candidateId }
      );

      console.log(response.data);
      toast.success(response.data.message);
      setVotes(response.data.votes);

      setShowOtpInput(false);
    } catch (err) {
      console.log(err)
      toast.error("OTP verification failed");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 w-80 p-5 flex flex-col items-center text-center relative">
      <Toaster position="top-center" />
      <img
        src={person}
        alt={candidateName}
        className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">{candidateName}</h2>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span className="font-medium">Votes:</span>
        <span className="font-bold text-indigo-600">{votes}</span>
      </div>
      <button
        onClick={handleVote}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
      >
        Cast Vote
      </button>

      {/* OTP Modal */}
      {showOtpInput && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl p-6 rounded-xl z-50 w-80 border">
          <h3 className="text-lg font-semibold mb-3 text-center">Enter OTP</h3>
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
  )
}

export default CandidateCard
