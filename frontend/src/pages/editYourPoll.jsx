import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const EditYourPoll = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedPoll = location.state?.poll;

  const [pollName, setPollName] = useState("");
  const [pollImageUrl, setPollImageUrl] = useState("");
  const [expiryDateTime, setExpiryDateTime] = useState("");
  const [candidatesArray, setCandidatesArray] = useState([]);

  useEffect(() => {
    if (passedPoll) {
      const expiry = new Date(passedPoll.expiryDate);
      const localDateTime = expiry.toISOString().slice(0, 16); // Format: yyyy-MM-ddTHH:mm

      setPollName(passedPoll.pollName);
      setPollImageUrl(passedPoll.pollImageUrl || "");
      setExpiryDateTime(localDateTime);
      setCandidatesArray(passedPoll.candidatesArray || []);
    }
  }, [passedPoll]);

  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidatesArray];
    updated[index][field] = value;
    setCandidatesArray(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPoll = {
      pollName,
      pollImageUrl,
      expiryDate: new Date(expiryDateTime).toISOString(),
      candidatesArray,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8000/api/v2/edityourpoll/${passedPoll._id}`,
        updatedPoll,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      if (res.data.loginStatus === 0) {
        toast.error("Login first");
        navigate("/login");
      }

      toast.success(res.data.message || "Poll updated successfully!");
      setTimeout(() => {
        navigate("/viewyourpolls");
      }, 1000);
    } catch (err) {
      console.error("Failed to update poll:", err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow-lg rounded-xl">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Poll</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium">Poll Name:</label>
          <input
            type="text"
            value={pollName}
            onChange={(e) => setPollName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* <div>
          <label className="block font-medium">Poll Image URL:</label>
          <input
            type="text"
            value={pollImageUrl}
            onChange={(e) => setPollImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div> */}

        <div>
          <label className="block font-medium">Expiry Date & Time:</label>
          <input
            type="datetime-local"
            value={expiryDateTime}
            onChange={(e) => setExpiryDateTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Candidates</h2>
          {candidatesArray.map((candidate, index) => (
            <div key={index} className="border p-4 mb-4 rounded-lg bg-gray-50">
              <p className="font-semibold mb-2">{candidate.candidateName}</p>

              <label className="block text-sm mb-1">Description:</label>
              <input
                type="text"
                value={candidate.description}
                onChange={(e) =>
                  handleCandidateChange(index, "description", e.target.value)
                }
                className="w-full p-2 mb-2 border rounded"
              />

              {/* <label className="block text-sm mb-1">Image URL:</label>
              <input
                type="text"
                value={candidate.candiadateImageUrl}
                onChange={(e) =>
                  handleCandidateChange(
                    index,
                    "candiadateImageUrl",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded"
              /> */}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Update Poll
        </button>
      </form>
    </div>
  );
};

export default EditYourPoll;
