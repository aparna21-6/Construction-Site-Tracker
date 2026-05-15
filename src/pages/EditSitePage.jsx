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
  const [attachment, setAttachment] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState("");
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
        setExistingAttachment(project.attachment || "");

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

      const formData = new FormData();
      formData.append("title", projectName.trim());
      formData.append("description", materials);
      formData.append("status", backendStatus);
      formData.append("progress", Number(progress) || 0);
      formData.append("priority", priority);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await updateProject(id, formData);

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

            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Upload Attachment
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={(e) => setAttachment(e.target.files[0])}
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-lg outline-none"
              />
              <p className="mt-2 text-sm text-black/70">
                Allowed: JPG, JPEG, PNG, WEBP, PDF
              </p>
            </div>

            {existingAttachment && (
              <div className="rounded-xl bg-white/70 p-4">
                <p className="mb-3 text-lg font-semibold text-black">Current Attachment</p>

                {existingAttachment.endsWith(".pdf") ? (
                  <a
                    href={import.meta.env.VITE_API_URL + existingAttachment}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 underline"
                  >
                    View Current PDF
                  </a>
                ) : (
                  <img
                    src={import.meta.env.VITE_API_URL + existingAttachment}
                    alt="Current attachment"
                    className="h-52 w-full rounded-xl object-cover"
                  />
                )}
              </div>
            )}

            {attachment && (
              <div className="rounded-xl bg-white/70 p-4 text-black">
                <p className="text-lg font-semibold">Selected file:</p>
                <p className="mt-1">{attachment.name}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-green-500 px-5 py-4 text-2xl font-bold text-white hover:bg-green-600 disabled:opacity-70"
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