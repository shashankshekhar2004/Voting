import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Clock } from "lucide-react";

const PollCard = ({ name, image, expiryDate, pollId, totalVotes }) => {
  const navigate = useNavigate();
  const isExpired = new Date(expiryDate) < new Date();

  const handleVoteClick = () => {
    navigate(`/pollcandiadtes/${pollId}`);
  };

  const handleResultClick = () => {
    navigate(`/pollcandiadtes/${pollId}`);
  };

  return (
    <div className="bg-white h-[50vh] dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden w-full max-w-sm hover:scale-[1.01] transition-all duration-300">
      {/* Image */}
      <img src={image} alt={name} className="w-full h-40 object-cover" />

      {/* Content */}
      <div className="p-5 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {name}
        </h2>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(expiryDate).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            {totalVotes} Votes
          </span>
        </div>

        {isExpired && (
          <span className="mt-2 px-3 py-1 text-xs text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200 rounded-md self-start font-medium">
            Poll Expired
          </span>
        )}

        <button
          onClick={isExpired ? handleResultClick : handleVoteClick}
          className={`mt-4 w-full py-2 rounded-lg text-white font-semibold transition duration-200 ${
            isExpired
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isExpired ? "Show Result" : "Cast Vote"}
        </button>
      </div>
    </div>
  );
};

export default PollCard;
