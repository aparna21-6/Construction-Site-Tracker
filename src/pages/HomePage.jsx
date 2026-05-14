import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <nav className="flex items-center justify-between bg-black/85 px-6 py-4 text-white">
        <div className="flex items-center gap-7">
          <h1 className="text-3xl font-bold">SiteTracker</h1>
          <Link to="/" className="text-xl text-gray-300 hover:text-white">
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/projects" className="text-xl text-gray-300 hover:text-white">
              Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/summary" className="text-xl text-gray-300 hover:text-white">
              Summary
            </Link>
          )}
        </div>

        <div className="flex items-center gap-6 text-lg">
          {isAuthenticated ? (
            <>
              <span className="text-yellow-400 font-medium">
                Welcome, {currentUser?.username || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl rounded-[30px] border border-white/20 bg-white/20 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">
          <h1 className="text-4xl font-extrabold text-black md:text-6xl">
            Construction Site Safety Tracker
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-black/80 md:text-2xl">
            Track construction projects, monitor site safety status, manage updates,
            and generate summary reports in one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/projects")}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={() => navigate("/projects/new")}
                  className="rounded-xl bg-green-600 px-6 py-3 text-lg font-semibold text-white hover:bg-green-700"
                >
                  Register New Site
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl bg-green-600 px-6 py-3 text-lg font-semibold text-white hover:bg-green-700"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-white/90 px-6 py-3 text-lg font-semibold text-black hover:bg-white"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;