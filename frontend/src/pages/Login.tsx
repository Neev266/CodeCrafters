import { useState } from "react";
import { login, loginWithGoogle } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-full max-w-md p-6 border rounded-2xl shadow-xl bg-card">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

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
          onClick={handleLogin}
        >
          Login
        </button>

        <button
          className="w-full p-2 border rounded"
          onClick={handleGoogle}
        >
          Continue with Google
        </button>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}