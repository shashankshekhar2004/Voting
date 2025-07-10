import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollCard";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v2/allpolls",
          {},
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );
        if (response.data.loginStatus === 0) {
          toast.error("Login first");
          navigate("/login");
        }
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
        toast.error("Failed to fetch polls.");
      }
    };
    fetchPoll();
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
      <Toaster position="top-center" />
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-white mb-8">
        🗳️ All Polls
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...polls]
          .sort((a, b) => {
            const aExpired = new Date(a.expiryDate) < new Date();
            const bExpired = new Date(b.expiryDate) < new Date();
            return aExpired - bExpired;
          })
          .map((poll) => (
            <PollCard
              key={poll._id}
              name={poll.pollName}
              image={poll.pollImageUrl}
              expiryDate={poll.expiryDate}
              pollId={poll._id}
              totalVotes={poll.totalVotes}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
