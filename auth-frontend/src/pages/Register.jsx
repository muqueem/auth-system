import { useState } from "react";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';


const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);
      debugger;
      if (res.success) {
        toast.success(res.message);
        console.log(`Click this link to verify your account: ${res.verifyLink}`);
        setMessage("Check console for email Verification");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="">
            <label htmlFor="username" className="block">Username:</label>
            <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            />
        </div>
        <div className="">
            <label htmlFor="email" className="block">Email:</label>
            <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            />
        </div>
        <div className="">
            <label htmlFor="password" className="block">Password</label>
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
          Register
        </button>
      </form>
      <p className="mt-4 text-blue-400">Already have an account ? <Link className="underline" to="/login">Login</Link></p>
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
};

export default Register;
