import React, { useEffect, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const CandidatePage = () => {
  const navigate = useNavigate();
  const { pollId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const userId = localStorage.getItem("id");
  const [expiryDate, setExpiryDate] = useState();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/api/v2/allpolls",
          {},
          { headers: { authorization: `${token}` } }
        );

        if (response.data.loginStatus === 0) {
          toast.error("Login first");
          navigate("/login");
          return;
        }

        const targetPoll = response.data.polls.find(
          (poll) => poll._id === pollId
        );
        if (targetPoll) {
          setCandidates(targetPoll.candidatesArray);
          setExpiryDate(targetPoll.expiryDate);
        } else {
          console.warn("Poll not found for pollId:", pollId);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Something went wrong");
      }
    };

    fetchCandidates();
  }, [pollId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-cyan-800 to-emerald-700 p-6">
      <Toaster position="top-center" />

      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
        Vote for Your Candidate
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {candidates.map((candidate) => (
          <div
            key={candidate.candidateId}
            className="transition-transform duration-300 hover:-translate-y-1"
          >
            <CandidateCard
              candidate={candidate}
              pollId={pollId}
              expiryDate={expiryDate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidatePage;
