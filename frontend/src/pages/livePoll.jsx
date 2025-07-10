import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollcard";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LivePolls = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const token = localStorage.getItem("token");
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
      }
    };
    fetchPoll();
  }, [navigate]);

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 h-[8vh] flex items-center justify-center shadow-md">
        <Toaster position="top-center" />
        <Marquee
          speed={170}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-widest"
        >
          ✦✦✦ LIVE POLLS ✦✦✦
        </Marquee>
      </div>
      <div className="p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...polls]
          .filter((poll) => new Date(poll.expiryDate) > new Date())
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
    </>
  );
};

export default LivePolls;
