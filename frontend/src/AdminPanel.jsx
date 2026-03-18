import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  ShieldOff,
  Trash2,
  BarChart3,
  Search,
  LogOut,
  Loader as LoaderIcon,
  Ban,
  CheckCircle,
  UserX,
  Activity,
} from "lucide-react";
import API_URL from "./config";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/users`, { headers }),
        fetch(`${API_URL}/admin/stats`, { headers }),
      ]);

      if (usersRes.status === 401 || usersRes.status === 403) {
        sessionStorage.clear();
        navigate("/login");
        return;
      }

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData.users || []);
      // Ensure statsData is an object even if the response is empty
      setStats(statsData || {
        totalUsers: 0,
        totalProfiles: 0,
        postedProfiles: 0,
        bannedUsers: 0
      });
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      // Initialize with zeros on error to avoid null display
      setStats({
        totalUsers: 0,
        totalProfiles: 0,
        postedProfiles: 0,
        bannedUsers: 0
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleBan = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
      else console.error("Failed to ban user");
    } catch {
      console.error("Error banning user");
    }
    setConfirmAction(null);
  };

  const handleUnban = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
      else console.error("Failed to unban user");
    } catch {
      console.error("Error unbanning user");
    }
    setConfirmAction(null);
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
      else console.error("Failed to delete user");
    } catch {
      console.error("Error deleting user");
    }
    setConfirmAction(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.role !== "admin" &&
      (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon
            className="animate-spin text-[#A259FF]"
            size={48}
            strokeWidth={3}
          />
          <span className="text-[#B3B3B3] text-base font-medium">
            Loading admin panel...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">
              {confirmAction.type === "delete"
                ? "Delete User"
                : confirmAction.type === "ban"
                ? "Ban User"
                : "Unban User"}
            </h3>
            <p className="text-[#B3B3B3] text-sm mb-6">
              {confirmAction.type === "delete"
                ? `Are you sure you want to permanently delete "${confirmAction.email}"? This will remove their account and profile.`
                : confirmAction.type === "ban"
                ? `Are you sure you want to ban "${confirmAction.email}"? They won't be able to log in.`
                : `Are you sure you want to unban "${confirmAction.email}"?`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === "delete")
                    handleDelete(confirmAction.id);
                  else if (confirmAction.type === "ban")
                    handleBan(confirmAction.id);
                  else handleUnban(confirmAction.id);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  confirmAction.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.type === "ban"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full bg-[#1A1A1A] border-b border-[#333]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#A259FF] to-[#8B3EF2] flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-[#888]">SIH Team Finder</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] rounded-lg text-sm transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-[#A259FF]" />
                <span className="text-sm text-[#888]">Total Users</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Activity size={20} className="text-green-400" />
                <span className="text-sm text-[#888]">Total Profiles</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalProfiles}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} className="text-blue-400" />
                <span className="text-sm text-[#888]">Posted Profiles</span>
              </div>
              <p className="text-3xl font-bold">{stats.postedProfiles}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <UserX size={20} className="text-red-400" />
                <span className="text-sm text-[#888]">Banned Users</span>
              </div>
              <p className="text-3xl font-bold text-red-400">
                {stats.bannedUsers}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:border-[#A259FF] focus:ring-1 focus:ring-[#A259FF] transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#333] flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users size={18} className="text-[#A259FF]" />
              User Management
            </h2>
            <span className="text-sm text-[#888]">
              {filteredUsers.length} users
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333] text-left text-xs text-[#888] uppercase">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Profile</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#888]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[#222] hover:bg-[#1F1F1F] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A259FF] to-[#8B3EF2] flex items-center justify-center text-xs font-bold">
                            {user.profile?.name?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </div>
                          <span className="font-medium text-sm">
                            {user.profile?.name || "No profile"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#B3B3B3]">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                            <Ban size={10} /> Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle size={10} /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#888]">
                        {user.isProfileComplete ? (
                          <span className="text-green-400">Complete</span>
                        ) : (
                          <span className="text-yellow-400">Incomplete</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#888]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {user.isBanned ? (
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  type: "unban",
                                  id: user._id,
                                  email: user.email,
                                })
                              }
                              className="p-2 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-400 transition-colors"
                              title="Unban User"
                            >
                              <ShieldOff size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  type: "ban",
                                  id: user._id,
                                  email: user.email,
                                })
                              }
                              className="p-2 rounded-lg bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 transition-colors"
                              title="Ban User"
                            >
                              <Ban size={14} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: "delete",
                                id: user._id,
                                email: user.email,
                              })
                            }
                            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#222]">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-[#888]">No users found</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A259FF] to-[#8B3EF2] flex items-center justify-center text-sm font-bold">
                        {user.profile?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {user.profile?.name || "No profile"}
                        </p>
                        <p className="text-xs text-[#888]">{user.email}</p>
                      </div>
                    </div>
                    {user.isBanned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                        <Ban size={10} /> Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle size={10} /> Active
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 justify-end">
                    {user.isBanned ? (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "unban",
                            id: user._id,
                            email: user.email,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <ShieldOff size={12} /> Unban
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "ban",
                            id: user._id,
                            email: user.email,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Ban size={12} /> Ban
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "delete",
                          id: user._id,
                          email: user.email,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
