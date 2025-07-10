import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [pollData, setPollData] = useState({
    pollName: "",
    description: "",
    pollImageUrl: "",
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
        candidateImageUrl: "",
      },
    ],
  });

  const [pollImage, setPollImage] = useState(null);
  const [candidateImages, setCandidateImages] = useState([]);

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
          candidateImageUrl: "",
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (pollImage) {
        const PollImgData = new FormData();
        PollImgData.append("image", pollImage);
        const pollImgResponse = await axios.post(
          "http://localhost:8000/api/v2/imageUpload",
          PollImgData,
          {
            headers: {
              authorization: `${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        pollData.pollImageUrl = pollImgResponse.data.imageUrl;
      }

      if (candidateImages.length > 0) {
        for (let i = 0; i < candidateImages.length; i++) {
          const candidateFormData = new FormData();
          candidateFormData.append("image", candidateImages[i]);
          const candidateImgResponse = await axios.post(
            "http://localhost:8000/api/v2/imageUpload",
            candidateFormData,
            {
              headers: {
                authorization: `${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          pollData.candidatesArray[i].candidateImageUrl =
            candidateImgResponse.data.imageUrl;
        }
      }

      const payload = {
        pollName: pollData.pollName,
        pollImageUrl: pollData.pollImageUrl,
        description: pollData.description,
        expiryDate: pollData.expiryDate,
        openToAll: pollData.openToAll,
        allowedDomains: pollData.allowedDomains,
        domainAccessType: pollData.domainAccessType,
        allowedRange:
          !pollData.openToAll && pollData.domainAccessType === "range"
            ? pollData.allowedRollRange
            : undefined,
        candidatesArray: pollData.candidatesArray,
      };

      const res = await axios.post(
        `http://localhost:8000/api/v2/createpoll/${userId}`,
        payload,
        { headers: { authorization: token } }
      );

      if (res.data.loginStatus === 0) {
        toast.error("Login first");
        navigate("/login");
        return;
      }

      toast.success("Poll created successfully!");
    } catch (error) {
      console.error("Poll creation failed:", error);
      toast.error("Poll creation failed!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-8 bg-gradient-to-br from-purple-100 via-purple-200 to-indigo-200 shadow-2xl rounded-3xl">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        🗳️ Create a New Poll
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="pollName"
          value={pollData.pollName}
          onChange={handleInputChange}
          placeholder="Poll Name"
          required
          className="w-full border border-indigo-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-300"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPollImage(e.target.files[0])}
          className="w-full border border-indigo-300 p-3 rounded-xl"
        />

        <textarea
          name="description"
          value={pollData.description}
          onChange={handleInputChange}
          placeholder="Poll Description"
          className="w-full border border-indigo-300 p-3 rounded-xl"
        />

        <label className="block text-sm font-medium text-indigo-700">
          Expiry Date & Time
        </label>
        <input
          type="datetime-local"
          name="expiryDate"
          value={pollData.expiryDate}
          onChange={handleInputChange}
          required
          placeholder="Select expiry date and time"
          className="w-full border border-indigo-300 p-3 rounded-xl"
        />

        <label className="flex items-center gap-2 text-indigo-700 font-medium">
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
          <div className="bg-purple-50 p-4 rounded-xl space-y-4 border border-purple-200">
            <input
              type="text"
              name="allowedDomains"
              value={pollData.allowedDomains}
              onChange={handleInputChange}
              placeholder="Allowed Domain (e.g. nitjsr.ac.in)"
              className="w-full border border-purple-300 p-3 rounded-xl"
              required
            />

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-purple-700">
                <input
                  type="radio"
                  name="domainAccessType"
                  value="all"
                  checked={pollData.domainAccessType === "all"}
                  onChange={handleInputChange}
                />
                Allow all emails of this domain
              </label>
              <label className="flex items-center gap-2 text-purple-700">
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
                  className="w-full border border-purple-300 p-3 rounded-xl"
                />
                <input
                  type="text"
                  name="allowedRollRange.to"
                  value={pollData.allowedRollRange.to}
                  onChange={handleInputChange}
                  placeholder="Roll Number To"
                  className="w-full border border-purple-300 p-3 rounded-xl"
                />
              </div>
            )}
          </div>
        )}

        <h3 className="text-lg font-semibold text-indigo-700">Candidates</h3>
        {pollData.candidatesArray.map((candidate, index) => (
          <div
            key={index}
            className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl space-y-2"
          >
            <input
              type="text"
              placeholder="Candidate Name"
              value={candidate.candidateName}
              onChange={(e) =>
                handleCandidateChange(index, "candidateName", e.target.value)
              }
              className="w-full border border-indigo-300 p-3 rounded-xl"
              required
            />
            <input
              type="text"
              placeholder="Candidate Description"
              value={candidate.description}
              onChange={(e) =>
                handleCandidateChange(index, "description", e.target.value)
              }
              className="w-full border border-indigo-300 p-3 rounded-xl"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const updatedImages = [...candidateImages];
                updatedImages[index] = e.target.files[0];
                setCandidateImages(updatedImages);
              }}
              className="w-full border border-indigo-300 p-3 rounded-xl"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addCandidate}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
        >
          ➕ Add Candidate
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 mt-4"
        >
          ✅ Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
