import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createProject } from "../services/projectService";

function NewSitePage() {
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("Stable");
  const [materials, setMaterials] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim() || !budget) {
      alert("Please fill required fields");
      return;
    }

    const backendStatus =
      status === "Critical"
        ? "delayed"
        : status === "Monitoring"
        ? "pending"
        : "active";

    const priority =
      status === "Critical"
        ? "high"
        : status === "Monitoring"
        ? "medium"
        : "low";

    const progress =
      status === "Critical" ? 15 : status === "Monitoring" ? 50 : 80;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", projectName.trim());
      formData.append("description", materials);
      formData.append("status", backendStatus);
      formData.append("priority", priority);
      formData.append("progress", progress);
      formData.append("location", "");
      formData.append("siteCode", "");
      formData.append("groupName", "");
      formData.append("budget", budget);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await createProject(formData);

      alert("Project added successfully");
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

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
            Register New Site
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Project Name
              </label>
              <input
                type="text"
                placeholder="e.g., Metro Bridge Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Budget (Cr)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-lg bg-white/90 px-5 py-4 text-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-2xl font-semibold text-black">
                Initial Safety Status
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
                Materials (comma separated)
              </label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
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

            {attachment && (
              <div className="rounded-xl bg-white/70 p-4 text-black">
                <p className="text-lg font-semibold">Selected file:</p>
                <p className="mt-1 break-all">{attachment.name}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-500 px-5 py-4 text-2xl font-bold text-white hover:bg-green-600 disabled:opacity-70"
            >
              {loading ? "Adding..." : "Add to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewSitePage;