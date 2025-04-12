import React from "react";

const PollCard = ({ name, image, description, expiryDate }) => {
  const isExpired = new Date(expiryDate) < new Date();

  return (
    <div className="relative max-w-sm h-[380px] bg-blue-400 rounded-2xl shadow-md overflow-hidden p-4 mx-11 border border-gray-900 flex flex-col">
      {/* Blinking Status Badge */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full animate-pulse ${
          isExpired ? "bg-green-300 text-green-900" : "bg-red-300 text-red-900"
        }`}
      >
        {isExpired ? "Expired" : "Live"}
      </span>

      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-xl"
      />
      <div className="mt-4 flex-1 overflow-auto">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-4">{description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Expires on:{" "}
          <span className="font-medium">
            {new Date(expiryDate).toDateString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PollCard;
