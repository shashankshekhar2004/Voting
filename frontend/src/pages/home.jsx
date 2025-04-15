import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollCard";
import img from "../assets/vote.jpg";
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
        // console.log(response.data.description);
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPoll();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r 	bg-zinc-800 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Toaster position="top-center" />
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
            image={img}
            expiryDate={poll.expiryDate}
            pollId={poll._id}
            totalVotes={poll.totalVotes}
          />
        ))}
    </div>
  );
};

export default Home;
