import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);
      if (res.success) {
        toast.success(res.message);
        localStorage.setItem("token", res.token);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else if (res.verifyLink) {
        toast.success("Please verify your email");
        setMessage("Check console for email Verification");
        console.log(`Click this link to verify your account: ${res.verifyLink}`);
      } else {
        toast.error(res.message);
        if (res.showForgotPassword) setShowForgotPassword(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="">
          <label htmlFor="email" className="block">
            Email:
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>
        <div className="">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded border"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      {showForgotPassword && <p className="mt-4 text-blue-400 cursor-pointer"><Link className="underline" to="/forgot-password">Forgot password</Link></p>}
      <p className="mt-4 text-blue-400 cursor-pointer">Don't have an accout ? <Link className="underline" to="/register">Create an Account</Link></p>
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
};

export default Login;
