import React, { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/pollCard";
import img from "../assets/vote.jpg";
import { useNavigate } from "react-router-dom";

const ViewYourPolls = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.post(
          `http://localhost:8000/api/v2/getyourpolls/${userId}`
        );
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPoll();
  }, []);

  const handleDelete = async (pollId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v2/deletepoll/${pollId}`);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== pollId));
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  const handleEdit = (pollId) => {
    navigate(`/editpoll/${pollId}`);
  };

  return (
    <div className="p-6 bg-zinc-700 min-h-screen grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...polls]
        .sort((a, b) => {
          const aExpired = new Date(a.expiryDate) < new Date();
          const bExpired = new Date(b.expiryDate) < new Date();
          return aExpired - bExpired;
        })
        .map((poll) => (
          <div
            key={poll._id}
            className="flex flex-col items-stretch bg-zinc-700  rounded-2xl overflow-hidden shadow-md"
          >
            <PollCard
              name={poll.pollName}
              image={img}
              description={poll.description}
              expiryDate={poll.expiryDate}
            />
            <div className="flex justify-center gap-4 p-4 bg-zinc-700 ">
              <button
                onClick={() => handleEdit(poll._id)}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(poll._id)}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ViewYourPolls;
