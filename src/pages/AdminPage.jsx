import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function AdminPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [dashboardRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/dashboard`, authHeaders),
        axios.get(`${API_BASE_URL}/api/admin/users`, authHeaders),
      ]);

      setStats(dashboardRes.data.stats);
      setUsers(usersRes.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";

      await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        authHeaders
      );

      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${username}?`);
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, authHeaders);
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.52), rgba(0,0,0,0.52)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-[24px] border border-white/20 bg-white/15 px-8 py-12 text-center shadow-xl backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-black">Loading admin data...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.52), rgba(0,0,0,0.52)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-[24px] border border-white/20 bg-white/15 px-8 py-12 text-center shadow-xl backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-red-700">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

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

            <Link to="/admin" className="text-base text-green-400 hover:text-green-300 md:text-xl">
              Admin Panel
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-base md:gap-6 md:text-lg">
            <span className="font-medium text-yellow-400">
              Welcome, {currentUser?.username || "Admin"}
            </span>

            <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white">
              Role: {currentUser?.role || "admin"}
            </span>

            <button onClick={handleLogout} className="text-gray-300 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <section className="mb-8 rounded-[24px] border border-white/20 bg-white/15 px-4 py-5 shadow-xl backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-black md:text-5xl">
                Admin Dashboard
              </h2>
              <p className="mt-2 text-base text-black/80 md:text-lg">
                Manage users, roles, and platform access from one place.
              </p>
            </div>

            <div className="rounded-xl bg-green-600 px-5 py-3 text-base text-white shadow md:px-6 md:text-lg">
              Admin Access Enabled
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[24px] border border-white/25 bg-white/20 p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <p className="text-lg text-black/80 md:text-xl">Total Users</p>
            <h3 className="mt-3 text-4xl font-extrabold text-blue-600 md:text-5xl">
              {stats?.totalUsers || 0}
            </h3>
          </div>

          <div className="rounded-[24px] border border-white/25 bg-white/20 p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <p className="text-lg text-black/80 md:text-xl">Admin Users</p>
            <h3 className="mt-3 text-4xl font-extrabold text-green-600 md:text-5xl">
              {stats?.totalAdmins || 0}
            </h3>
          </div>

          <div className="rounded-[24px] border border-white/25 bg-white/20 p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <p className="text-lg text-black/80 md:text-xl">Regular Users</p>
            <h3 className="mt-3 text-4xl font-extrabold text-yellow-500 md:text-5xl">
              {stats?.totalRegularUsers || 0}
            </h3>
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-white/20 bg-white/15 px-4 py-5 shadow-xl backdrop-blur-xl md:px-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-black md:text-4xl">Manage Users</h2>
              <p className="mt-1 text-black/75">
                Search users, update roles, and delete accounts.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search by username or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/30 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-gray-500 focus:border-blue-400 lg:w-80"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white/70">
            <table className="w-full text-left">
              <thead className="bg-black/85 text-white">
                <tr>
                  <th className="px-4 py-4 text-sm font-semibold md:text-base">Username</th>
                  <th className="px-4 py-4 text-sm font-semibold md:text-base">Email</th>
                  <th className="px-4 py-4 text-sm font-semibold md:text-base">Role</th>
                  <th className="px-4 py-4 text-sm font-semibold md:text-base">Joined</th>
                  <th className="px-4 py-4 text-sm font-semibold md:text-base">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 last:border-b-0">
                    <td className="px-4 py-4 font-semibold text-black">{user.username}</td>
                    <td className="px-4 py-4 text-gray-700">{user.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          user.role === "admin"
                            ? "border border-green-300 bg-green-100 text-green-800"
                            : "border border-gray-300 bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRoleChange(user._id, user.role)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          {user.role === "admin" ? "Make User" : "Make Admin"}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id, user.username)}
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-600">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;