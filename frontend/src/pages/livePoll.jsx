import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollcard";
import img from "../assets/vote.jpg";
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

        // console.log(response.data);
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPoll();
  }, []);

  return (
    <>
      <div className="bg-emerald-50 h-[8vh] flex justify-center">
        <Toaster position="top-center" />
        <Marquee speed={170} className="text-5xl text-black">
          ---LIVE POLLS---
        </Marquee>
      </div>
      <div className="p-6 bg-zinc-700 min-h-screen grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
