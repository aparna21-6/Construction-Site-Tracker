import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProjectById, updateProject } from "../services/projectService";

function EditSitePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState("Stable");
  const [materials, setMaterials] = useState("");
  const [progress, setProgress] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const project = await getProjectById(id);

        setProjectName(project.title || "");
        setMaterials(project.description || "");
        setProgress(project.progress ?? 0);
        setPriority(project.priority || "medium");

        if (project.status === "active") setStatus("Stable");
        else if (project.status === "pending") setStatus("Monitoring");
        else if (project.status === "delayed") setStatus("Critical");
        else setStatus("Stable");
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to load project");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("Project name is required");
      return;
    }

    let backendStatus = "active";
    if (status === "Monitoring") backendStatus = "pending";
    if (status === "Critical") backendStatus = "delayed";

    try {
      setSaving(true);

      await updateProject(id, {
        title: projectName.trim(),
        description: materials,
        status: backendStatus,
        progress: Number(progress) || 0,
        priority,
      });

      alert("Project updated successfully");
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="rounded-[24px] bg-white/20 px-8 py-6 text-2xl font-bold text-white backdrop-blur-xl">
          Loading project...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <nav className="flex items-center justify-between bg-black/85 px-6 py-4 text-white">
        <div className="flex items-center gap-7">
          <h1 className="text-3xl font-bold">SiteTracker</h1>
          <Link to="/" className="text-xl text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/projects" className="text-xl text-gray-300 hover:text-white">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xl">
          <span className="text-yellow-400">
            Welcome, {currentUser?.username || "User"}
          </span>
        </div>
      </nav>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-[28px] border border-white/25 bg-white/20 p-10 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-10 text-center text-5xl font-bold text-black">
            Update Site
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-xl outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Safety Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-xl outline-none"
              >
                <option>Stable</option>
                <option>Monitoring</option>
                <option>Critical</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-xl outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Materials / Notes
              </label>
              <textarea
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                rows="4"
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-xl outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-green-500 px-5 py-4 text-2xl font-bold text-white hover:bg-green-600"
            >
              {saving ? "Saving..." : "Update Site"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSitePage;