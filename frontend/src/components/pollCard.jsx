import React from "react";
import { useNavigate } from "react-router-dom";

const PollCard = ({ name, image, description, expiryDate, pollId }) => {
  const navigate = useNavigate();

  const handleVoteClick = () => {
    navigate(`/pollcandiadtes/${pollId}`);
  };

  const handleResultClick = () => {
    navigate(`/result/${pollId}`);
  };

  const isExpired = new Date(expiryDate) < new Date();

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center text-center">
      <img src={image} alt={name} className="w-48 h-32 object-cover mb-4 rounded-md" />
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-xs text-gray-400 mb-4">Expires on: {new Date(expiryDate).toLocaleDateString()}</p>
      {isExpired ? (
        <button
          onClick={handleResultClick}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          Show Result
        </button>
      ) : (
        <button
          onClick={handleVoteClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Cast Vote 
        </button>
      )}
    </div>
  );
};

export default PollCard;
