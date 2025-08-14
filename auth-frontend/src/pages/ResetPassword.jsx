import React, { useState } from "react";
import { resetPassword } from "../api/auth";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(token, { password });
      if (res.success) {
        toast.success(res.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block mb-2">
            New Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 p-2 rounded hover:bg-green-600"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-green-400">{message}</p>}
    </div>
  );
};

export default ResetPassword;
