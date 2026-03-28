import { useState } from "react";
import { signup } from "../lib/auth"; // ✅ FIXED
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup(email, password); // ✅ FIXED
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-full max-w-md p-6 border rounded-2xl shadow-xl bg-card">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full mb-3 p-2 bg-black text-white rounded"
          onClick={handleSignup}
        >
          Create Account
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}