import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Verify Email");

  const verifyEmail = async () => {
    if (loading) return; // Prevent multiple requests
    setLoading(true);
    setMessage("Verifying...");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        setMessage("Email Verified ✅");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Verification failed");
        setMessage(data.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={verifyEmail}
        disabled={loading}
        className={`px-5 py-2 text-xl rounded-xl ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
        }`}
      >
        {message}
      </button>
    </div>
  );
};

export default VerifyEmail;
