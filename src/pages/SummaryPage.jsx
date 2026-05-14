import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllProjects } from "../services/projectService";

function SummaryPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to load summary data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === "active").length;
    const pending = projects.filter((p) => p.status === "pending").length;
    const delayed = projects.filter((p) => p.status === "delayed").length;
    const completed = projects.filter((p) => p.status === "completed").length;

    const avgProgress =
      total > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / total
          )
        : 0;

    const highPriority = projects.filter((p) => p.priority === "high").length;
    const mediumPriority = projects.filter((p) => p.priority === "medium").length;
    const lowPriority = projects.filter((p) => p.priority === "low").length;

    return {
      total,
      active,
      pending,
      delayed,
      completed,
      avgProgress,
      highPriority,
      mediumPriority,
      lowPriority,
    };
  }, [projects]);

  const statusLabel = (status) => {
    if (status === "active") return "Stable";
    if (status === "pending") return "Monitoring";
    if (status === "delayed") return "Critical";
    return "Completed";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-black/85 px-4 py-4 text-white backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4 md:gap-7">
            <h1 className="text-2xl font-bold md:text-3xl">SiteTracker</h1>
            <Link to="/" className="text-base text-gray-300 hover:text-white md:text-xl">
              Home
            </Link>
            <Link to="/projects" className="text-base text-gray-300 hover:text-white md:text-xl">
              Dashboard
            </Link>
            <Link to="/summary" className="text-base text-gray-300 hover:text-white md:text-xl">
              Summary
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-base md:gap-6 md:text-lg">
            <span className="font-medium text-yellow-400">
              Welcome, {currentUser?.username || "User"}
            </span>
            <button onClick={handleLogout} className="text-gray-300 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <section className="mb-8 rounded-[24px] border border-white/20 bg-white/15 px-5 py-6 shadow-xl backdrop-blur-xl md:px-8 md:py-8">
          <h2 className="text-center text-3xl font-extrabold text-black md:text-5xl">
            Project Summary
          </h2>
          <p className="mt-3 text-center text-lg text-black/80">
            Overview of all construction site records for {currentUser?.username || "User"}.
          </p>
        </section>

        {loading ? (
          <div className="rounded-[24px] border border-white/20 bg-white/15 px-6 py-12 text-center shadow-xl backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-black">Loading summary...</h3>
          </div>
        ) : (
          <>
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-lg font-medium text-black/70">Total Projects</p>
                <h3 className="mt-3 text-4xl font-bold text-blue-600">{stats.total}</h3>
              </div>

              <div className="rounded-[24px] border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-lg font-medium text-black/70">Average Progress</p>
                <h3 className="mt-3 text-4xl font-bold text-green-600">{stats.avgProgress}%</h3>
              </div>

              <div className="rounded-[24px] border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-lg font-medium text-black/70">Critical Sites</p>
                <h3 className="mt-3 text-4xl font-bold text-red-500">{stats.delayed}</h3>
              </div>

              <div className="rounded-[24px] border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-lg font-medium text-black/70">Completed</p>
                <h3 className="mt-3 text-4xl font-bold text-indigo-600">{stats.completed}</h3>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[24px] border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-black">Status Breakdown</h3>
                <div className="mt-6 space-y-4 text-lg text-black">
                  <div className="flex items-center justify-between">
                    <span>Stable</span>
                    <span className="font-bold text-green-600">{stats.active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monitoring</span>
                    <span className="font-bold text-yellow-600">{stats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Critical</span>
                    <span className="font-bold text-red-600">{stats.delayed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed</span>
                    <span className="font-bold text-blue-600">{stats.completed}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-black">Priority Breakdown</h3>
                <div className="mt-6 space-y-4 text-lg text-black">
                  <div className="flex items-center justify-between">
                    <span>High Priority</span>
                    <span className="font-bold text-red-500">{stats.highPriority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Medium Priority</span>
                    <span className="font-bold text-yellow-600">{stats.mediumPriority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Low Priority</span>
                    <span className="font-bold text-green-600">{stats.lowPriority}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-[24px] border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold text-black">Project List</h3>
                <button
                  onClick={() => navigate("/projects/new")}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-base text-white shadow hover:bg-blue-700 md:text-lg"
                >
                  + Register New Site
                </button>
              </div>

              {projects.length === 0 ? (
                <p className="text-lg text-black/80">No projects available yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/30 text-black">
                        <th className="px-4 py-3 text-lg font-bold">Project</th>
                        <th className="px-4 py-3 text-lg font-bold">Status</th>
                        <th className="px-4 py-3 text-lg font-bold">Progress</th>
                        <th className="px-4 py-3 text-lg font-bold">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project._id} className="border-b border-white/20 text-black">
                          <td className="px-4 py-4 text-base md:text-lg">{project.title}</td>
                          <td className="px-4 py-4 text-base md:text-lg">
                            {statusLabel(project.status)}
                          </td>
                          <td className="px-4 py-4 text-base md:text-lg">
                            {project.progress ?? 0}%
                          </td>
                          <td className="px-4 py-4 text-base md:text-lg capitalize">
                            {project.priority || "medium"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default SummaryPage;