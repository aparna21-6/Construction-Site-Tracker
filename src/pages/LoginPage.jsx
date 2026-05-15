import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login: saveAuth } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: login.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      saveAuth(data.user, data.token);
      navigate("/projects");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-[28px] border border-white/25 bg-white/20 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <h1 className="mb-8 text-center text-4xl md:text-5xl font-bold tracking-wide text-black">
            LOGIN
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Email or Username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full rounded-lg bg-white/90 px-4 py-3 text-lg outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-white/90 px-4 py-3 text-lg outline-none"
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-white/90 px-4 py-3 text-2xl font-bold text-black hover:bg-white transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}

          <p className="mt-7 text-center text-base text-black/80">
            Don’t have an account?{" "}
            <Link to="/register" className="font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <footer className="bg-black/80 py-4 text-center text-lg font-semibold text-white">
        © 2025 Construction Site Safety Tracker
      </footer>
    </div>
  );
}

export default LoginPage;