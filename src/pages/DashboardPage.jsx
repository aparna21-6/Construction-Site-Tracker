import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useAuth } from "../context/AuthContext";
import { getAllProjects, deleteProject } from "../services/projectService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const badgeStyles = {
  active: "bg-green-100 text-green-800 border border-green-300",
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  delayed: "bg-red-100 text-red-700 border border-red-300",
  completed: "bg-blue-100 text-blue-800 border border-blue-300",
};

function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setSites(data);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmed) return;

    try {
      await deleteProject(id);
      setSites((prev) => prev.filter((project) => project._id !== id));
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete project");
    }
  };

  const stableCount = useMemo(
    () => sites.filter((site) => site.status === "active").length,
    [sites]
  );

  const monitoringCount = useMemo(
    () => sites.filter((site) => site.status === "pending").length,
    [sites]
  );

  const criticalCount = useMemo(
    () => sites.filter((site) => site.status === "delayed").length,
    [sites]
  );

  const total = sites.length || 1;
  const stableDeg = (stableCount / total) * 360;
  const monitoringDeg = (monitoringCount / total) * 360;

  const statusLabel = (status) => {
    if (status === "active") return "Stable";
    if (status === "pending") return "Monitoring";
    if (status === "delayed") return "Critical";
    return "Completed";
  };

  const getAttachmentUrl = (attachment) => `${API_BASE_URL}${attachment}`;

  const openPdfInNewTab = (doc, fileName) => {
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    const newTab = window.open("", "_blank");

    if (!newTab) {
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }

    newTab.document.write(`
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #f3f4f6; }
            .toolbar {
              display: flex; justify-content: space-between; align-items: center;
              padding: 12px 18px; background: #111827; color: white;
            }
            .actions { display: flex; gap: 10px; }
            .btn {
              border: none; padding: 10px 14px; border-radius: 8px;
              cursor: pointer; font-size: 14px; font-weight: 600;
            }
            .download { background: #2563eb; color: white; }
            .close { background: #e5e7eb; color: #111827; }
            iframe { width: 100%; height: calc(100vh - 58px); border: none; }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <div>${fileName}</div>
            <div class="actions">
              <a href="${blobUrl}" download="${fileName}.pdf">
                <button class="btn download">Download PDF</button>
              </a>
              <button class="btn close" onclick="window.close()">Close</button>
            </div>
          </div>
          <iframe src="${blobUrl}"></iframe>
        </body>
      </html>
    `);

    newTab.document.close();
  };

  const generateAllSitesPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("All Projects Summary Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`User: ${currentUser?.username || "User"}`, 14, 30);
    doc.text(`Total Projects: ${sites.length}`, 14, 38);
    doc.text(`Stable: ${stableCount}`, 14, 46);
    doc.text(`Monitoring: ${monitoringCount}`, 60, 46);
    doc.text(`Critical: ${criticalCount}`, 120, 46);

    let y = 60;

    doc.setFillColor(30, 100, 180);
    doc.rect(14, y, 182, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Project Name", 18, y + 7);
    doc.text("Progress", 110, y + 7);
    doc.text("Status", 160, y + 7);

    y += 16;
    doc.setTextColor(0, 0, 0);

    sites.forEach((site, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, y - 6, 182, 10, "F");
      }

      doc.text(site.title || "Untitled", 18, y);
      doc.text(`${site.progress ?? 0}%`, 110, y);
      doc.text(statusLabel(site.status), 160, y);
      y += 10;
    });

    openPdfInNewTab(doc, "All-Projects-Summary-Report");
  };

  const generateSingleSitePdf = (site) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Site Summary Report", 14, 20);

    doc.setFontSize(16);
    doc.text(site.title || "Untitled", 14, 35);

    doc.setFontSize(12);
    doc.text(`User: ${currentUser?.username || "User"}`, 14, 48);
    doc.text(`Status: ${statusLabel(site.status)}`, 14, 58);
    doc.text(`Progress: ${site.progress ?? 0}%`, 14, 68);
    doc.text(`Priority: ${site.priority || "N/A"}`, 14, 78);

    doc.setDrawColor(180);
    doc.line(14, 86, 196, 86);

    doc.setFontSize(12);
    const text =
      `${site.title || "This site"} is currently marked as ${statusLabel(site.status)}. ` +
      `Its recorded progress is ${site.progress ?? 0}%. ` +
      `Priority level is ${site.priority || "N/A"}.`;

    const wrapped = doc.splitTextToSize(text, 170);
    doc.text(wrapped, 14, 98);

    openPdfInNewTab(doc, `${(site.title || "site").replace(/\s+/g, "-")}-Summary`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.52), rgba(0,0,0,0.52)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
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
          </div>

          <div className="flex flex-wrap items-center gap-4 text-base md:gap-6 md:text-lg">
            <span className="font-medium text-yellow-400">
              Welcome, {currentUser?.username || "User"}
            </span>

            <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white">
              Role: {currentUser?.role || "user"}
            </span>

            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-xl bg-green-600 px-5 py-3 text-base text-white shadow hover:bg-green-700 md:text-lg"
              >
                Admin Panel
              </Link>
            )}

            <button onClick={handleLogout} className="text-gray-300 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto mb-8 max-w-3xl rounded-[28px] border border-white/20 bg-white/20 p-5 shadow-2xl backdrop-blur-xl md:mb-10 md:p-8">
          <h2 className="mb-6 text-center text-3xl font-bold text-black md:text-4xl">
            Site Health Analytics
          </h2>

          <div
            className="relative mx-auto h-56 w-56 rounded-full md:h-72 md:w-72"
            style={{
              background: `conic-gradient(
                #22c55e 0deg ${stableDeg}deg,
                #facc15 ${stableDeg}deg ${stableDeg + monitoringDeg}deg,
                #ef4444 ${stableDeg + monitoringDeg}deg 360deg
              )`,
            }}
          >
            <div className="absolute inset-10 rounded-full bg-white/35 backdrop-blur-sm md:inset-12" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white md:mt-8 md:gap-8 md:text-lg">
            <div className="flex items-center gap-2">
              <span className="h-4 w-10 rounded-sm bg-green-500" /> Stable ({stableCount})
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-10 rounded-sm bg-yellow-400" /> Monitoring ({monitoringCount})
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-10 rounded-sm bg-red-500" /> Critical ({criticalCount})
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[24px] border border-white/20 bg-white/15 px-4 py-5 shadow-xl backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold text-black md:text-5xl">Dashboard</h2>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={generateAllSitesPdf}
                className="rounded-xl bg-white/90 px-5 py-3 text-base text-rose-400 shadow hover:bg-white md:px-6 md:text-lg"
              >
                Summary Report
              </button>

              <button
                onClick={() => navigate("/projects/new")}
                className="rounded-xl bg-blue-600 px-5 py-3 text-base text-white shadow hover:bg-blue-700 md:px-6 md:text-lg"
              >
                + Register New Site
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[24px] border border-white/20 bg-white/15 px-6 py-12 text-center shadow-xl backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-black">Loading projects...</h3>
          </div>
        ) : sites.length === 0 ? (
          <div className="rounded-[24px] border border-white/20 bg-white/15 px-6 py-12 text-center shadow-xl backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-black">No projects yet</h3>
            <p className="mt-3 text-lg text-black/80">
              Register your first construction site to start building your dashboard.
            </p>
            <button
              onClick={() => navigate("/projects/new")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-lg text-white hover:bg-blue-700"
            >
              Add First Project
            </button>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {sites.map((site) => (
              <article
                key={site._id}
                className="rounded-[24px] border border-white/25 bg-white/20 p-5 shadow-2xl backdrop-blur-xl transition hover:bg-white/25 md:p-6"
              >
                {site.attachment && (
                  <div className="mb-4 overflow-hidden rounded-2xl bg-white/60">
                    {site.attachment.toLowerCase().endsWith(".pdf") ? (
                      <a
                        href={getAttachmentUrl(site.attachment)}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-4 py-3 text-center font-semibold text-blue-700 underline"
                      >
                        View Attachment PDF
                      </a>
                    ) : (
                      <img
                        src={getAttachmentUrl(site.attachment)}
                        alt={site.title}
                        className="h-44 w-full object-cover"
                      />
                    )}
                  </div>
                )}

                <div className="min-h-[84px]">
                  <h3 className="break-words text-2xl font-bold leading-tight text-blue-500 md:text-3xl">
                    {site.title}
                  </h3>
                </div>

                <div className="mt-4 space-y-3 text-black">
                  <p className="text-lg md:text-2xl">
                    Progress: <span className="font-bold">{site.progress ?? 0}%</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg md:text-xl">Status:</span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold md:text-base ${
                        badgeStyles[site.status] ||
                        "border border-gray-300 bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabel(site.status)}
                    </span>
                  </div>

                  {site.priority && (
                    <p className="text-lg md:text-xl">
                      Priority: <span className="font-semibold capitalize">{site.priority}</span>
                    </p>
                  )}
                </div>

                <div className="my-5 border-b border-white/40" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/projects/${site._id}/edit`)}
                      className="rounded-lg border border-black/25 bg-white/85 px-4 py-2 text-base text-black hover:bg-white md:text-lg"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => generateSingleSitePdf(site)}
                      className="rounded-lg border border-rose-200 bg-white/70 px-4 py-2 text-base text-rose-400 hover:bg-white md:text-lg"
                    >
                      PDF
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(site._id, site.title)}
                    className="text-base text-rose-300 hover:text-rose-200 md:text-lg"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;