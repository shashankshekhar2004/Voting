import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [pollData, setPollData] = useState({
    pollName: "",
    pollImageUrl: "",
    description: "",
    expiryDate: "",
    openToAll: true,
    allowedDomains: "",
    domainAccessType: "all",
    allowedRollRange: {
      from: "",
      to: "",
    },
    candidatesArray: [
      {
        candidateName: "",
        description: "",
        candiadateImageUrl: "",
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("allowedRollRange.")) {
      const key = name.split(".")[1];
      setPollData((prev) => ({
        ...prev,
        allowedRollRange: {
          ...prev.allowedRollRange,
          [key]: value,
        },
      }));
    } else {
      setPollData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...pollData.candidatesArray];
    updatedCandidates[index][field] = value;
    setPollData({ ...pollData, candidatesArray: updatedCandidates });
  };

  const addCandidate = () => {
    setPollData({
      ...pollData,
      candidatesArray: [
        ...pollData.candidatesArray,
        {
          candidateName: "",
          description: "",
          candiadateImageUrl: "",
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...pollData,
      allowedRange:
        !pollData.openToAll && pollData.domainAccessType === "range"
          ? pollData.allowedRollRange
          : undefined,
    };

    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:8000/api/v2/createpoll/${userId}`,
        payload,
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
      console.log("Poll created:", res.data);
      toast.success("Poll created successfully!");
    } catch (error) {
      console.error("Failed to create poll:", error);
      toast.error("Poll creation failed!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded mt-6">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-4">Create a Poll</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="pollName"
          value={pollData.pollName}
          onChange={handleInputChange}
          placeholder="Poll Name"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="pollImageUrl"
          value={pollData.pollImageUrl}
          onChange={handleInputChange}
          placeholder="Poll Image URL"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={pollData.description}
          onChange={handleInputChange}
          placeholder="Poll Description"
          className="w-full border p-2 rounded"
        />

        <input
          type="datetime-local"
          name="expiryDate"
          value={pollData.expiryDate}
          onChange={handleInputChange}
          required
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            name="openToAll"
            checked={pollData.openToAll}
            onChange={handleInputChange}
            className="h-4 w-4"
          />
          Open to All
        </label>

        {!pollData.openToAll && (
          <div className="border rounded p-4 bg-gray-100 space-y-4">
            <input
              type="text"
              name="allowedDomains"
              value={pollData.allowedDomains}
              onChange={handleInputChange}
              placeholder="Allowed Domain (e.g. nitjsr.ac.in)"
              className="w-full border p-2 rounded"
              required
            />

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="domainAccessType"
                  value="all"
                  checked={pollData.domainAccessType === "all"}
                  onChange={handleInputChange}
                />
                Allow all emails of this domain
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="domainAccessType"
                  value="range"
                  checked={pollData.domainAccessType === "range"}
                  onChange={handleInputChange}
                />
                Allow only roll number range
              </label>
            </div>

            {pollData.domainAccessType === "range" && (
              <div className="flex gap-4">
                <input
                  type="text"
                  name="allowedRollRange.from"
                  value={pollData.allowedRollRange.from}
                  onChange={handleInputChange}
                  placeholder="Roll Number From"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="allowedRollRange.to"
                  value={pollData.allowedRollRange.to}
                  onChange={handleInputChange}
                  placeholder="Roll Number To"
                  className="w-full border p-2 rounded"
                />
              </div>
            )}
          </div>
        )}

        <h3 className="text-lg font-semibold">Candidates</h3>
        {pollData.candidatesArray.map((candidate, index) => (
          <div key={index} className="border p-4 rounded space-y-2 bg-gray-50">
            <input
              type="text"
              placeholder="Candidate Name"
              value={candidate.candidateName}
              onChange={(e) =>
                handleCandidateChange(index, "candidateName", e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Candidate Description"
              value={candidate.description}
              onChange={(e) =>
                handleCandidateChange(index, "description", e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Candidate Image URL"
              value={candidate.candiadateImageUrl}
              onChange={(e) =>
                handleCandidateChange(
                  index,
                  "candiadateImageUrl",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addCandidate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Candidate
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
