import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollcard";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ExpirePolls = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
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
        toast.error("Failed to fetch polls");
      }
    };
    fetchPoll();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
      <Toaster position="top-center" />
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-white mb-8">
        🕒 Expired Polls
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...polls]
          .filter((poll) => new Date(poll.expiryDate) <= new Date())
          .map((poll) => (
            <PollCard
              key={poll._id}
              pollId={poll._id}
              name={poll.pollName}
              image={poll.pollImageUrl}
              description={poll.description}
              expiryDate={poll.expiryDate}
              totalVotes={poll.totalVotes}
            />
          ))}
      </div>
    </div>
  );
};

export default ExpirePolls;
