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

      // Upload poll image
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
        console.log(pollImgResponse.data.imageUrl)
        pollData.pollImageUrl = pollImgResponse.data.imageUrl;
      }

      // Upload candidate images
      if (candidateImages.length > 0) {
        for (let i = 0; i < candidateImages.length; i++) {
          var candidateFormData = new FormData();
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
          // console.log(candidateImgResponse.data.imageUrl)
          // console.log(candidateImgResponse.data)
          pollData.candidatesArray[i].candidateImageUrl = candidateImgResponse.data.imageUrl;
          // console.log(pollData.candidatesArray[i].candidateImageUrl)
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
      console.log(payload);

      const res = await axios.post(
        `http://localhost:8000/api/v2/createpoll/${userId}`,
        payload,
        {
          headers: { authorization: token },
        }
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
          type="file"
          accept="image/*"
          onChange={(e) => setPollImage(e.target.files[0])}
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
                  checked={pollData.domainAccessType === "*"}
                  onChange={handleInputChange}
                />
                Allow all emails of this domain
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="domainAccessType"
                  value="range"
                  checked={pollData.domainAccessType === "*"}
                  onChange={handleInputChange}
                />
                Allow only roll number range
              </label>
            </div>

            {pollData.domainAccessType === "*" && (
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
              type="file"
              accept="image/*"
              onChange={(e) => {
                const updatedImages = [...candidateImages];
                updatedImages[index] = e.target.files[0];
                setCandidateImages(updatedImages);
              }}
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
