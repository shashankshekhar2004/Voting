import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollCard";
import img from "../assets/vote.jpg";

const Home = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v2/allpolls"
        );
        console.log(response.data);
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPoll();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r 	from-lime-400 via-yellow-300 to-orange-400 min-h-screen grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
            description={poll.description}
            expiryDate={poll.expiryDate}
          />
        ))}
    </div>
  );
};

export default Home;
