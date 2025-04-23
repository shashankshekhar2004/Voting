import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollcard";
import img from "../assets/vote.jpg";
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
        // console.log(response.data);
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPoll();
  }, []);

  return (
    <div className="p-6 bg-zinc-700 min-h-screen grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Toaster position="top-center" />
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
  );
};

export default ExpirePolls;
