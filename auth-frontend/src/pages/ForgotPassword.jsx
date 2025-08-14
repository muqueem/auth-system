import React, { useState } from "react";
import { forgotPassword } from "../api/auth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const res = await forgotPassword({ email });
      if (res.success) {
        toast.success(res.message);
        setMessage("Check console to reset password link");
      } else {
        toast.error(res.message);
        setMessage(res.message);
      }
      console.log(`Click to reset your password: ${res.resetLink}`);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block mb-2">
            Enter your email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600"
        >
          Send Reset Link
        </button>
      </form>
      <p className="mt-4 text-blue-400 underline"><Link to="/login">Go to Login</Link></p>
      {message && <p className="mt-4 text-green-400">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
