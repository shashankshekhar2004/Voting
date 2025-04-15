import React, { use, useEffect, useState } from "react";
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

  const allowed = async () => {
    try {
      if (!userId || !pollId) {
        toast.error("Missing user or poll ID");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/v2/allowedtovote/${userId}`,
        { pollId }
      );

      const { allowedToVote, message } = response.data;
      toast.dismiss();

      allowedToVote ? toast.success(message) : toast.error(message);
    } catch (error) {
      console.error("Error checking voting permission:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/api/v2/allpolls",
          {},
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );
        if (response.data.loginStatus === 0) {
          toast.error("Login first");
          navigate("/login");
        }
        const polls = response.data.polls;
        const targetPoll = polls.find((poll) => poll._id === pollId);
        setExpiryDate(targetPoll.expiryDate);
        //console.log(expiryDate);
        if (targetPoll) {
          setCandidates(targetPoll.candidatesArray);
        } else {
          console.warn("Poll not found for pollId:", pollId);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
    // allowed();
  }, []);

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6 bg-zinc-800 min-h-screen">
      <Toaster position="top-center" />
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.candidateId}
          candidate={candidate}
          pollId={pollId}
          expiryDate={expiryDate}
        />
      ))}
    </div>
  );
};

export default CandidatePage;
