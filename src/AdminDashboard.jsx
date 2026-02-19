import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Users, Building2, ClipboardCheck, Mail, Settings, Shield, LayoutDashboard, ChevronRight, ChevronDown, ChevronUp, Search, X, Check, AlertCircle, Eye, Edit3, ArrowLeft, LogOut, BarChart3, TrendingUp, Clock, RefreshCw, Trash2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useAdminData } from "./useAdminData";
import { FRAMEWORK, BENCHMARK_PROFILES, calcScores } from "./App";

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// HELPER FUNCTIONS
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function formatDate(ts) {
  if (!ts) return "\u2014";
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(ts) {
  if (!ts) return "\u2014";
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function truncate(str, len = 100) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "â¦" : str;
}

function getAssessmentScore(assessment) {
  if (!assessment?.ratings || Object.keys(assessment.ratings).length === 0) return null;
  const benchmarkObj = BENCHMARK_PROFILES["M&A-Ready"] || BENCHMARK_PROFILES[Object.keys(BENCHMARK_PROFILES)[0]];
  const scores = calcScores(assessment.ratings, benchmarkObj);
  return scores;
}

function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function sortItems(items, field, order) {
  return [...items].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    if (aVal == null) aVal = "";
    if (bVal == null) bVal = "";
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// REUSABLE SUB-COMPONENTS
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function PaginationControls({ page, pageSize, total, onChange }) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
      <span className="text-sm text-gray-600">
        {Math.min((page - 1) * pageSize + 1, total)}â{Math.min(page * pageSize, total)} of {total}
      </span>
      <div className="flex gap-2">
        <button onClick={() => onChange(page - 1)} disabled={page <= 1} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
        <span className="px-3 py-1 text-sm text-gray-600">Page {page} of {maxPage}</span>
        <button onClick={() => onChange(page + 1)} disabled={page >= maxPage} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}

function SortableHeader({ field, label, currentField, currentOrder, onSort, className = "" }) {
  const active = currentField === field;
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none ${className}`}
      onClick={() => onSort(field, active && currentOrder === "asc" ? "desc" : "asc")}
    >
      <span className="flex items-center gap-1">
        {label}
        {active && (currentOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </span>
    </th>
  );
}

function Badge({ children, color = "gray" }) {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", confirmColor = "blue" }) {
  const btnColors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
    amber: "bg-amber-600 hover:bg-amber-700",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${btnColors[confirmColor] || btnColors.blue}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = "blue", subtitle }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-50 text-gray-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon size={40} className="mx-auto text-gray-300 mb-3" />}
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {message && <p className="text-xs text-gray-400 mt-1">{message}</p>}
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN OVERVIEW
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminOverview({ users, firms, assessments, contacts, stats }) {
  // Sign-ups over time (last 12 weeks)
  const signUpData = useMemo(() => {
    const weeks = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const count = users.filter(u => {
        const d = new Date(u.created_at);
        return d >= weekStart && d < weekEnd;
      }).length;
      weeks.push({
        week: weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        signups: count,
      });
    }
    return weeks;
  }, [users]);

  // Average score across all assessments
  const avgScore = useMemo(() => {
    const scored = assessments.filter(a => a.ratings && Object.keys(a.ratings).length > 0);
    if (scored.length === 0) return 0;
    const total = scored.reduce((sum, a) => {
      const s = getAssessmentScore(a);
      return sum + (s?.readinessScore || 0);
    }, 0);
    return Math.round(total / scored.length);
  }, [assessments]);

  // Assessments this month
  const assessmentsThisMonth = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return assessments.filter(a => new Date(a.created_at) >= monthStart).length;
  }, [assessments]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="blue" subtitle={`${stats.freeUsers} free · ${stats.premiumUsers} premium`} />
        <StatCard label="Total Firms" value={stats.totalFirms} icon={Building2} color="green" />
        <StatCard label="Assessments" value={stats.totalAssessments} icon={ClipboardCheck} color="purple" subtitle={`${assessmentsThisMonth} this month`} />
        <StatCard label="Unread Messages" value={stats.unreadContacts} icon={Mail} color={stats.unreadContacts > 0 ? "amber" : "gray"} subtitle={`${stats.totalContacts} total`} />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon={Clock} color={stats.pendingApprovals > 0 ? "red" : "gray"} />
        <StatCard label="Avg Readiness Score" value={`${avgScore}%`} icon={TrendingUp} color="blue" />
      </div>

      {/* Sign-ups chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Sign-ups (last 12 weeks)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={signUpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="signups" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Users</h3>
        <div className="space-y-2">
          {users.slice(0, 5).map(u => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <span className="text-sm font-medium text-gray-900">{u.full_name}</span>
                <span className="text-xs text-gray-500 ml-2">{u.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={u.tier === "premium" ? "blue" : "gray"}>{u.tier}</Badge>
                <span className="text-xs text-gray-400">{formatDate(u.created_at)}</span>
              </div>
            </div>
          ))}
          {users.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No users yet</p>}
        </div>
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN USERS TABLE
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminUsersTable({ users, firms, assessments, onSelectUser, appConfig }) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const pendingUsers = users.filter(u => !u.approved);
  const showPending = appConfig.approval_mode === "manual" && pendingUsers.length > 0;

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.full_name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q) && !u.company_name?.toLowerCase().includes(q)) return false;
      }
      if (tierFilter !== "all" && u.tier !== tierFilter) return false;
      if (approvedFilter === "yes" && !u.approved) return false;
      if (approvedFilter === "no" && u.approved) return false;
      return true;
    });
  }, [users, search, tierFilter, approvedFilter]);

  const sorted = useMemo(() => sortItems(filtered, sortField, sortOrder), [filtered, sortField, sortOrder]);
  const paged = paginate(sorted, page, pageSize);

  const handleSort = (field, order) => { setSortField(field); setSortOrder(order); setPage(1); };

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, tierFilter, approvedFilter]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Users</h2>
        <span className="text-sm text-gray-500">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Pending approvals banner */}
      {showPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <AlertCircle size={16} />
            Pending Approvals ({pendingUsers.length})
          </h3>
          <div className="space-y-2">
            {pendingUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-amber-100">
                <div>
                  <span className="text-sm font-medium">{u.full_name}</span>
                  <span className="text-xs text-gray-500 ml-2">{u.email}</span>
                  {u.company_name && <span className="text-xs text-gray-400 ml-2">({u.company_name})</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onSelectUser(u, "approve")} className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                  <button onClick={() => onSelectUser(u, "reject")} className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or company..." />
        </div>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Tiers</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <select value={approvedFilter} onChange={e => setApprovedFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="yes">Approved</option>
          <option value="no">Pending / Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader field="full_name" label="Name" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader field="email" label="Email" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader field="company_name" label="Company" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader field="tier" label="Tier" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Firms</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assessments</th>
                <SortableHeader field="created_at" label="Signed Up" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(u => {
                const userFirms = firms.filter(f => f.user_id === u.id).length;
                const userAssessments = assessments.filter(a => a.user_id === u.id).length;
                return (
                  <tr key={u.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectUser(u)}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.company_name || "\u2014"}</td>
                    <td className="px-4 py-3"><Badge color={u.tier === "premium" ? "blue" : "gray"}>{u.tier}</Badge></td>
                    <td className="px-4 py-3"><Badge color={u.approved ? "green" : "amber"}>{u.approved ? "Approved" : "Pending"}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{userFirms}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{userAssessments}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3"><ChevronRight size={16} className="text-gray-400" /></td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls page={page} pageSize={pageSize} total={sorted.length} onChange={setPage} />
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN USER DETAIL
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminUserDetail({ user: selectedUser, firms, assessments, onBack, onSave, onLogAudit, onViewFirm, onDeleteUser }) {
  const [tier, setTier] = useState(selectedUser.tier);
  const [approved, setApproved] = useState(selectedUser.approved);
  const [role, setRole] = useState(selectedUser.role);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const userFirms = firms.filter(f => f.user_id === selectedUser.id);
  const userAssessments = assessments.filter(a => a.user_id === selectedUser.id);
  const hasChanges = tier !== selectedUser.tier || approved !== selectedUser.approved || role !== selectedUser.role;

  const handleSave = async () => {
    setConfirm({
      title: "Save Changes",
      message: `Update ${selectedUser.full_name}'s profile? Changes: ${tier !== selectedUser.tier ? `Tier â ${tier}. ` : ""}${approved !== selectedUser.approved ? `Approved â ${approved}. ` : ""}${role !== selectedUser.role ? `Role â ${role}. ` : ""}`,
      confirmLabel: "Save",
      confirmColor: "blue",
      onConfirm: async () => {
        setSaving(true);
        setConfirm(null);
        try {
          const changes = {};
          if (tier !== selectedUser.tier) changes.tier = tier;
          if (approved !== selectedUser.approved) changes.approved = approved;
          if (role !== selectedUser.role) changes.role = role;

          await onSave(selectedUser.id, changes);

          // Log each change
          for (const [field, newValue] of Object.entries(changes)) {
            await onLogAudit({
              action: `update_${field}`,
              targetUserId: selectedUser.id,
              targetResource: "profiles",
              targetResourceId: selectedUser.id,
              details: { field, old_value: selectedUser[field], new_value: newValue },
            });
          }
        } catch (err) {
          alert("Error saving: " + err.message);
        } finally {
          setSaving(false);
        }
      },
      onCancel: () => setConfirm(null),
    });
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {confirm && <ConfirmDialog {...confirm} />}

      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to Users
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{selectedUser.full_name}</h2>
          <p className="text-sm text-gray-500">{selectedUser.email}</p>
        </div>
        <div className="flex gap-2">
          <Badge color={selectedUser.tier === "premium" ? "blue" : "gray"}>{selectedUser.tier}</Badge>
          <Badge color={selectedUser.approved ? "green" : "amber"}>{selectedUser.approved ? "Approved" : "Pending"}</Badge>
          <Badge color={selectedUser.role === "admin" ? "purple" : "gray"}>{selectedUser.role}</Badge>
        </div>
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Profile Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Company:</span> <span className="font-medium ml-1">{selectedUser.company_name || "\u2014"}</span></div>
          <div><span className="text-gray-500">Job Title:</span> <span className="font-medium ml-1">{selectedUser.job_title || "\u2014"}</span></div>
          <div><span className="text-gray-500">Revenue Band:</span> <span className="font-medium ml-1">{selectedUser.revenue_band || "\u2014"}</span></div>
          <div><span className="text-gray-500">Signed Up:</span> <span className="font-medium ml-1">{formatDateTime(selectedUser.created_at)}</span></div>
          <div><span className="text-gray-500">Last Active:</span> <span className="font-medium ml-1">{formatDateTime(selectedUser.last_active_at)}</span></div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Manage Account</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tier</label>
            <select value={tier} onChange={e => setTier(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Approved</label>
            <select value={approved ? "yes" : "no"} onChange={e => setApproved(e.target.value === "yes")} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        {hasChanges && (
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={() => { setTier(selectedUser.tier); setApproved(selectedUser.approved); setRole(selectedUser.role); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        {!selectedUser.approved && (
          <button onClick={() => { setApproved(true); }} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Check size={16} /> Approve User
          </button>
        )}
        {selectedUser.tier === "free" && (
          <button onClick={() => { setTier("premium"); }} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <TrendingUp size={16} /> Upgrade to Premium
          </button>
        )}
        {selectedUser.tier === "premium" && (
          <button onClick={() => { setTier("free"); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            Downgrade to Free
          </button>
        )}
        {onDeleteUser && (
          <button onClick={() => onDeleteUser(selectedUser)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2 ml-auto">
            <Trash2 size={16} /> Delete User
          </button>
        )}
      </div>

      {/* User's firms */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Firms ({userFirms.length})</h3>
        {userFirms.length > 0 ? (
          <div className="space-y-2">
            {userFirms.map(f => {
              const fAssessments = userAssessments.filter(a => a.firm_id === f.id);
              const latestAssessment = fAssessments[0];
              const score = latestAssessment ? getAssessmentScore(latestAssessment) : null;
              return (
                <div key={f.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100" onClick={() => onViewFirm(f)}>
                  <div>
                    <span className="text-sm font-medium">{f.name}</span>
                    {f.sector && <span className="text-xs text-gray-500 ml-2">({f.sector})</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {score && <span className="text-sm font-medium text-gray-600">{score.readinessScore}%</span>}
                    <span className="text-xs text-gray-400">{fAssessments.length} assessment{fAssessments.length !== 1 ? "s" : ""}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No firms created</p>
        )}
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN FIRMS TABLE
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminFirmsTable({ firms, users, assessments, onSelectFirm }) {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const sectors = useMemo(() => [...new Set(firms.map(f => f.sector).filter(Boolean))].sort(), [firms]);

  const enrichedFirms = useMemo(() => {
    return firms.map(f => {
      const owner = users.find(u => u.id === f.user_id);
      const fAssessments = assessments.filter(a => a.firm_id === f.id);
      const latest = fAssessments[0];
      const score = latest ? getAssessmentScore(latest) : null;
      return {
        ...f,
        ownerName: owner?.full_name || "Unknown",
        ownerEmail: owner?.email || "",
        assessmentCount: fAssessments.length,
        latestScore: score?.readinessScore || null,
        lastAssessmentDate: latest?.created_at || null,
      };
    });
  }, [firms, users, assessments]);

  const filtered = useMemo(() => {
    return enrichedFirms.filter(f => {
      if (search) {
        const q = search.toLowerCase();
        if (!f.name?.toLowerCase().includes(q) && !f.ownerName?.toLowerCase().includes(q) && !f.ownerEmail?.toLowerCase().includes(q)) return false;
      }
      if (sectorFilter !== "all" && f.sector !== sectorFilter) return false;
      return true;
    });
  }, [enrichedFirms, search, sectorFilter]);

  const sorted = useMemo(() => sortItems(filtered, sortField, sortOrder), [filtered, sortField, sortOrder]);
  const paged = paginate(sorted, page, pageSize);

  const handleSort = (field, order) => { setSortField(field); setSortOrder(order); setPage(1); };
  useEffect(() => { setPage(1); }, [search, sectorFilter]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Firms</h2>
        <span className="text-sm text-gray-500">{filtered.length} firm{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by firm name or owner..." />
        </div>
        <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Sectors</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader field="name" label="Firm Name" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader field="sector" label="Sector" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader field="ownerName" label="Owner" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader field="latestScore" label="Latest Score" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assessments</th>
                <SortableHeader field="created_at" label="Created" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(f => (
                <tr key={f.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectFirm(f)}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.sector || "\u2014"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.ownerName}<br/><span className="text-xs text-gray-400">{f.ownerEmail}</span></td>
                  <td className="px-4 py-3 text-sm font-medium">{f.latestScore != null ? `${f.latestScore}%` : "\u2014"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.assessmentCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(f.created_at)}</td>
                  <td className="px-4 py-3"><ChevronRight size={16} className="text-gray-400" /></td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No firms found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls page={page} pageSize={pageSize} total={sorted.length} onChange={setPage} />
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN FIRM DETAIL
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminFirmDetail({ firm, users, assessments, onBack, onViewAssessment }) {
  const owner = users.find(u => u.id === firm.user_id);
  const firmAssessments = assessments.filter(a => a.firm_id === firm.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to Firms
      </button>

      <div>
        <h2 className="text-xl font-bold text-gray-900">{firm.name}</h2>
        <p className="text-sm text-gray-500">{firm.sector || "No sector"} · Created {formatDate(firm.created_at)}</p>
      </div>

      {/* Owner info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Owner</h3>
        <div className="text-sm">
          <p className="font-medium">{owner?.full_name || "Unknown"}</p>
          <p className="text-gray-500">{owner?.email}</p>
          {owner?.company_name && <p className="text-gray-400">{owner.company_name}</p>}
        </div>
      </div>

      {/* Assessments */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Assessments ({firmAssessments.length})</h3>
        {firmAssessments.length > 0 ? (
          <div className="space-y-2">
            {firmAssessments.map(a => {
              const score = getAssessmentScore(a);
              const ratedCount = Object.keys(a.ratings || {}).length;
              return (
                <div key={a.id} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100" onClick={() => onViewAssessment(a)}>
                  <div>
                    <span className="text-sm font-medium">Assessment</span>
                    <span className="text-xs text-gray-500 ml-2">{formatDateTime(a.created_at)}</span>
                    <span className="text-xs text-gray-400 ml-2">{ratedCount}/57 metrics rated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {score && (
                      <span className={`text-sm font-bold ${score.readinessScore >= 70 ? "text-green-600" : score.readinessScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
                        {score.readinessScore}%
                      </span>
                    )}
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No assessments yet</p>
        )}
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN ASSESSMENT DASHBOARD
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminAssessmentDashboard({ assessment, firm, owner, onBack, onSaveRatings, onLogAudit }) {
  const [editMode, setEditMode] = useState(false);
  const [localRatings, setLocalRatings] = useState(assessment.ratings || {});
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState("scores");

  const benchmarkObj = BENCHMARK_PROFILES["M&A-Ready"] || BENCHMARK_PROFILES[Object.keys(BENCHMARK_PROFILES)[0]];
  const scores = useMemo(() => calcScores(localRatings, benchmarkObj), [localRatings, benchmarkObj]);

  const handleRate = (metricId, level) => {
    if (!editMode) return;
    setLocalRatings(prev => ({
      ...prev,
      [metricId]: { ...(prev[metricId] || {}), level, updatedAt: new Date().toISOString() },
    }));
  };

  const handleSave = () => {
    const changedMetrics = Object.keys(localRatings).filter(k => {
      const orig = assessment.ratings?.[k];
      const curr = localRatings[k];
      return (!orig && curr?.level) || (orig?.level !== curr?.level);
    });

    setConfirm({
      title: "Save Rating Changes",
      message: `Save ${changedMetrics.length} changed metric(s) for this assessment? This will update the user's data and create an audit log entry.`,
      confirmLabel: "Save",
      confirmColor: "blue",
      onConfirm: async () => {
        setSaving(true);
        setConfirm(null);
        try {
          await onSaveRatings(assessment.id, localRatings);
          await onLogAudit({
            action: "edit_assessment_ratings",
            targetUserId: assessment.user_id,
            targetResource: "assessments",
            targetResourceId: assessment.id,
            details: { metrics_changed: changedMetrics.length, metric_ids: changedMetrics },
          });
          setEditMode(false);
        } catch (err) {
          alert("Error saving: " + err.message);
        } finally {
          setSaving(false);
        }
      },
      onCancel: () => setConfirm(null),
    });
  };

  const handleCancelEdit = () => {
    setLocalRatings(assessment.ratings || {});
    setEditMode(false);
  };

  const tabs = [
    { id: "scores", label: "Scores" },
    { id: "heatmap", label: "Heatmap" },
    { id: "gaps", label: "Gap Analysis" },
    { id: "edit", label: "Edit Ratings" },
  ];

  return (
    <div className="p-6 space-y-4">
      {confirm && <ConfirmDialog {...confirm} />}

      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{firm?.name || "Assessment"}</h2>
          <p className="text-sm text-gray-500">
            Owner: {owner?.full_name || "Unknown"} · {formatDateTime(assessment.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {scores && (
            <div className={`text-2xl font-bold ${scores.readinessScore >= 70 ? "text-green-600" : scores.readinessScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
              {scores.readinessScore}%
            </div>
          )}
        </div>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-blue-800 font-medium">Edit Mode - Changes are not saved until you click Save</span>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={handleCancelEdit} className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); if (t.id === "edit" && !editMode) setEditMode(true); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "scores" && (
        <AdminScoresTab scores={scores} benchmarkObj={benchmarkObj} />
      )}
      {activeTab === "heatmap" && (
        <AdminHeatmapTab ratings={localRatings} />
      )}
      {activeTab === "gaps" && (
        <AdminGapAnalysisTab scores={scores} benchmarkObj={benchmarkObj} />
      )}
      {activeTab === "edit" && (
        <AdminEditRatingsTab ratings={localRatings} onRate={handleRate} editMode={editMode} onToggleEdit={() => setEditMode(!editMode)} />
      )}
    </div>
  );
}

// ââ Assessment sub-tabs ââââââââââââââââââââââââââââââââââââ

function AdminScoresTab({ scores, benchmarkObj }) {
  if (!scores) return <EmptyState icon={BarChart3} title="No scores" message="No metrics have been rated yet" />;

  const themeData = FRAMEWORK.themes.map(theme => {
    const ts = scores.themeScores[theme.id];
    const benchmarkPct = benchmarkObj?.[theme.id] || 0;
    return {
      name: theme.name,
      score: ts?.pct || 0,
      benchmark: benchmarkPct,
      rated: ts?.rated || 0,
      total: ts?.total || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Readiness score */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-500 mb-2">M&A Readiness Score</p>
        <p className={`text-4xl font-bold ${scores.readinessScore >= 70 ? "text-green-600" : scores.readinessScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
          {scores.readinessScore}%
        </p>
        <p className="text-sm text-gray-400 mt-1">{scores.readinessLevel}</p>
        <p className="text-xs text-gray-400 mt-1">{scores.ratedCount}/{scores.totalMetrics} metrics rated</p>
      </div>

      {/* Radar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Maturity Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={themeData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Your Score" dataKey="score" stroke="#1B4F72" fill="#1B4F72" fillOpacity={0.35} strokeWidth={3} />
              <Radar name="M&A-Ready" dataKey="benchmark" stroke="#D97706" fill="#D97706" fillOpacity={0.05} strokeWidth={2} strokeDasharray="5 5" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Theme scores table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dimension</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Benchmark</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gap</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {themeData.map(t => {
              const gap = t.score - t.benchmark;
              return (
                <tr key={t.name}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{t.score}%</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{t.benchmark}%</td>
                  <td className={`px-4 py-3 text-sm font-medium ${gap >= 0 ? "text-green-600" : "text-red-600"}`}>{gap >= 0 ? "+" : ""}{gap}%</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{t.rated}/{t.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminHeatmapTab({ ratings }) {
  const levelColors = {
    0: { bg: "#F0F0F0", text: "#9CA3AF", label: "Not Rated" },
    1: { bg: "#FFE0B2", text: "#92400E", label: "Foundational" },
    2: { bg: "#BBDEFB", text: "#1E40AF", label: "Evolving" },
    3: { bg: "#A5D6A7", text: "#166534", label: "Optimised" },
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex gap-4 text-xs">
        {Object.entries(levelColors).map(([level, c]) => (
          <div key={level} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: c.bg }} />
            <span className="text-gray-600">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {FRAMEWORK.themes.map(theme => (
          <div key={theme.id} className="mb-4 last:mb-0">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">{theme.name}</h4>
            <div className="grid grid-cols-2 gap-2">
              {theme.metrics.map(metric => {
                const rating = ratings[metric.id];
                const level = rating?.level || 0;
                const c = levelColors[level];
                return (
                  <div key={metric.id} className="px-3 py-2 rounded text-xs font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
                    {metric.name} - {c.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminGapAnalysisTab({ scores, benchmarkObj }) {
  if (!scores) return <EmptyState icon={BarChart3} title="No data" message="Rate some metrics first" />;

  const gaps = FRAMEWORK.themes.map(theme => {
    const ts = scores.themeScores[theme.id];
    const benchmark = benchmarkObj?.[theme.id] || 0;
    const score = ts?.pct || 0;
    const gap = benchmark - score;
    return { name: theme.name, score, benchmark, gap, positive: gap <= 0 };
  }).sort((a, b) => b.gap - a.gap);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Gap Analysis vs M&A-Ready Benchmark</h3>
      {gaps.map(g => (
        <div key={g.name} className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-600 w-40 flex-shrink-0">{g.name}</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${g.score}%`, backgroundColor: g.positive ? "#22c55e" : "#ef4444" }} />
            <div className="absolute inset-y-0 border-l-2 border-amber-500" style={{ left: `${g.benchmark}%` }} />
          </div>
          <span className={`text-xs font-medium w-12 text-right ${g.positive ? "text-green-600" : "text-red-600"}`}>
            {g.positive ? "+" : "-"}{Math.abs(g.gap)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function AdminEditRatingsTab({ ratings, onRate, editMode, onToggleEdit }) {
  return (
    <div className="space-y-4">
      {!editMode && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-3">Click "Edit Ratings" to modify this assessment's metric scores</p>
          <button onClick={onToggleEdit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Edit3 size={14} className="inline mr-1" /> Enable Edit Mode
          </button>
        </div>
      )}

      {FRAMEWORK.themes.map(theme => (
        <div key={theme.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{theme.name}</h3>
          <div className="space-y-3">
            {theme.metrics.map(metric => {
              const rating = ratings[metric.id];
              const currentLevel = rating?.level || 0;
              return (
                <div key={metric.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-gray-800">{metric.name}</p>
                    <p className="text-xs text-gray-400">{metric.question}</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(level => (
                      <button
                        key={level}
                        onClick={() => onRate(metric.id, level)}
                        disabled={!editMode}
                        className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
                          currentLevel === level
                            ? level === 1 ? "bg-amber-200 text-amber-800 ring-2 ring-amber-400"
                            : level === 2 ? "bg-blue-200 text-blue-800 ring-2 ring-blue-400"
                            : "bg-green-200 text-green-800 ring-2 ring-green-400"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        } ${!editMode ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN CONTACTS TABLE
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminContactsTable({ contacts, users, onSelectContact }) {
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      if (filter === "unread" && c.read) return false;
      if (filter === "read" && !c.read) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.name?.toLowerCase().includes(q) && !c.email?.toLowerCase().includes(q) && !c.message?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [contacts, filter, search]);

  const paged = paginate(filtered, page, pageSize);
  useEffect(() => { setPage(1); }, [filter, search]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Contact Submissions</h2>
        <span className="text-sm text-gray-500">{contacts.filter(c => !c.read).length} unread</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search messages..." />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-8"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Context</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(c => {
                const contactUser = c.user_id ? users.find(u => u.id === c.user_id) : null;
                return (
                  <tr key={c.id} className={`hover:bg-gray-50 cursor-pointer ${!c.read ? "bg-blue-50/50" : ""}`} onClick={() => onSelectContact(c)}>
                    <td className="px-4 py-3">{!c.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(c.created_at)}</td>
                    <td className={`px-4 py-3 text-sm ${!c.read ? "font-semibold text-gray-900" : "text-gray-600"}`}>{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{truncate(c.message, 80)}</td>
                    <td className="px-4 py-3 text-sm">
                      {c.source_context && <Badge color="purple">{c.source_context}</Badge>}
                      {contactUser && <Badge color="blue">Registered</Badge>}
                    </td>
                    <td className="px-4 py-3"><ChevronRight size={16} className="text-gray-400" /></td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No messages found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN CONTACT DETAIL
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminContactDetail({ contact, users, onBack, onMarkRead, onMarkUnread, onDelete }) {
  const contactUser = contact.user_id ? users.find(u => u.id === contact.user_id) : null;
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Auto-mark as read
  useEffect(() => {
    if (!contact.read) {
      onMarkRead(contact.id);
    }
  }, [contact.id, contact.read, onMarkRead]);

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to Contacts
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
          <p className="text-sm text-gray-500">{contact.email} · {formatDateTime(contact.created_at)}</p>
        </div>
        <div className="flex gap-2">
          {contact.source_context && <Badge color="purple">{contact.source_context}</Badge>}
          <Badge color={contact.read ? "gray" : "blue"}>{contact.read ? "Read" : "Unread"}</Badge>
        </div>
      </div>

      {/* Message */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Message</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
      </div>

      {/* User context */}
      {contactUser && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Registered User</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium ml-1">{contactUser.full_name}</span></div>
            <div><span className="text-gray-500">Company:</span> <span className="font-medium ml-1">{contactUser.company_name || "\u2014"}</span></div>
            <div><span className="text-gray-500">Tier:</span> <Badge color={contactUser.tier === "premium" ? "blue" : "gray"}>{contactUser.tier}</Badge></div>
            <div><span className="text-gray-500">Signed Up:</span> <span className="font-medium ml-1">{formatDate(contactUser.created_at)}</span></div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <a href={`mailto:${contact.email}?subject=Re: GrowthLens Enquiry`} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Mail size={16} /> Reply via Email
        </a>
        {contact.read ? (
          <button onClick={() => onMarkUnread(contact.id)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Mark as Unread
          </button>
        ) : (
          <button onClick={() => onMarkRead(contact.id)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Mark as Read
          </button>
        )}
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600 font-medium">Delete this submission?</span>
            <button onClick={async () => { await onDelete(contact.id); onBack(); }} className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
              Confirm
            </button>
            <button onClick={() => setConfirmDelete(false)} className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN SETTINGS
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminSettings({ appConfig, onUpdateConfig, onLogAudit }) {
  const [approvalMode, setApprovalMode] = useState(appConfig.approval_mode || "auto");
  const [defaultTier, setDefaultTier] = useState(appConfig.default_tier || "free");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const hasChanges = approvalMode !== (appConfig.approval_mode || "auto") || defaultTier !== (appConfig.default_tier || "free");

  const handleSave = () => {
    setConfirm({
      title: "Update Settings",
      message: `Save platform settings? ${approvalMode !== appConfig.approval_mode ? `Approval mode â ${approvalMode}. ` : ""}${defaultTier !== appConfig.default_tier ? `Default tier â ${defaultTier}. ` : ""}`,
      confirmLabel: "Save",
      confirmColor: "blue",
      onConfirm: async () => {
        setSaving(true);
        setConfirm(null);
        try {
          if (approvalMode !== appConfig.approval_mode) {
            await onUpdateConfig("approval_mode", approvalMode);
            await onLogAudit({
              action: "update_config",
              targetResource: "app_config",
              details: { key: "approval_mode", old_value: appConfig.approval_mode, new_value: approvalMode },
            });
          }
          if (defaultTier !== appConfig.default_tier) {
            await onUpdateConfig("default_tier", defaultTier);
            await onLogAudit({
              action: "update_config",
              targetResource: "app_config",
              details: { key: "default_tier", old_value: appConfig.default_tier, new_value: defaultTier },
            });
          }
        } catch (err) {
          alert("Error saving: " + err.message);
        } finally {
          setSaving(false);
        }
      },
      onCancel: () => setConfirm(null),
    });
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      {confirm && <ConfirmDialog {...confirm} />}
      <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2><p className="text-xs text-gray-400 mt-1">This is a demonstration environment. User credentials are stored client-side for demo purposes. For production use, implement server-side authentication.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Approval Mode</label>
          <p className="text-xs text-gray-400 mb-2">Controls whether new sign-ups are automatically approved or require manual admin approval.</p>
          <select value={approvalMode} onChange={e => setApprovalMode(e.target.value)} className="w-full max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="auto">Auto - Users approved immediately</option>
            <option value="manual">Manual - Admin approval required</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Tier for New Users</label>
          <p className="text-xs text-gray-400 mb-2">The tier assigned to new user accounts on sign-up.</p>
          <select value={defaultTier} onChange={e => setDefaultTier(e.target.value)} className="w-full max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        {hasChanges && (
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <button onClick={() => { setApprovalMode(appConfig.approval_mode || "auto"); setDefaultTier(appConfig.default_tier || "free"); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ADMIN AUDIT LOG
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function AdminAuditLog({ auditLog, users }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const filtered = useMemo(() => {
    if (!search) return auditLog;
    const q = search.toLowerCase();
    return auditLog.filter(entry => {
      const admin = users.find(u => u.id === entry.admin_id);
      const target = users.find(u => u.id === entry.target_user_id);
      return (
        entry.action?.toLowerCase().includes(q) ||
        admin?.full_name?.toLowerCase().includes(q) ||
        target?.full_name?.toLowerCase().includes(q) ||
        JSON.stringify(entry.details)?.toLowerCase().includes(q)
      );
    });
  }, [auditLog, users, search]);

  const paged = paginate(filtered, page, pageSize);
  useEffect(() => { setPage(1); }, [search]);

  const getActionLabel = (action) => {
    const labels = {
      update_tier: "Updated Tier",
      update_approved: "Updated Approval",
      update_role: "Updated Role",
      approve_user: "Approved User",
      reject_user: "Rejected User",
      edit_assessment_ratings: "Edited Ratings",
      mark_contact_read: "Read Contact",
      update_config: "Updated Config",
    };
    return labels[action] || action;
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Audit Log</h2><p className="text-xs text-gray-400 mt-1">Tracks activity in this browser session only. Export regularly to maintain records.</p>

      <div className="max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Search audit entries..." />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Target User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(entry => {
                const admin = users.find(u => u.id === entry.admin_id);
                const target = users.find(u => u.id === entry.target_user_id);
                return (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDateTime(entry.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{admin?.full_name || "Unknown"}</td>
                    <td className="px-4 py-3"><Badge color="blue">{getActionLabel(entry.action)}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{target?.full_name || "\u2014"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{entry.details ? JSON.stringify(entry.details) : "\u2014"}</td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No audit entries found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
      </div>
    </div>
  );
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// MAIN ADMIN DASHBOARD COMPONENT
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "firms", label: "Firms", icon: Building2 },
  { id: "contacts", label: "Contacts", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "audit", label: "Audit Log", icon: Shield },
];

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const adminData = useAdminData();
  const { users, firms, assessments, contacts, auditLog, appConfig, stats, loading, error, updateUserProfile, rejectUser, deleteUser, updateAssessmentRatings, markContactRead, markContactUnread, deleteContact, updateAppConfig, logAudit, reload } = adminData;

  const [view, setView] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle pending approval actions from users table
  const handleUserAction = useCallback((user, action) => {
    if (action === "approve") {
      setConfirm({
        title: "Approve User",
        message: `Approve ${user.full_name} (${user.email})?`,
        confirmLabel: "Approve",
        confirmColor: "green",
        onConfirm: async () => {
          setConfirm(null);
          await updateUserProfile(user.id, { approved: true });
          await logAudit({ action: "approve_user", targetUserId: user.id, targetResource: "profiles", targetResourceId: user.id, details: { approved: true } });
        },
        onCancel: () => setConfirm(null),
      });
    } else if (action === "reject") {
      setConfirm({
        title: "Reject User",
        message: `Reject ${user.full_name} (${user.email})? Their account will remain but be marked as unapproved.`,
        confirmLabel: "Reject",
        confirmColor: "red",
        onConfirm: async () => {
          setConfirm(null);
          await rejectUser(user.id);
          await logAudit({ action: "reject_user", targetUserId: user.id, targetResource: "profiles", targetResourceId: user.id, details: { approved: false } });
        },
        onCancel: () => setConfirm(null),
      });
    } else if (action === "delete") {
      setConfirm({
        title: "Delete User",
        message: `Permanently delete ${user.full_name} (${user.email})? This will remove all their firms, assessments, and data. This action cannot be undone.`,
        confirmLabel: "Delete User",
        confirmColor: "red",
        onConfirm: async () => {
          setConfirm(null);
          try {
            await deleteUser(user.id);
            await logAudit({ action: "delete_user", targetUserId: user.id, targetResource: "profiles", targetResourceId: user.id, details: { email: user.email, full_name: user.full_name } });
            setSelectedUser(null);
            setView("users");
          } catch (err) {
            console.error("Delete user failed:", err);
          }
        },
        onCancel: () => setConfirm(null),
      });
    } else {
      setSelectedUser(user);
      setView("user-detail");
    }
  }, [updateUserProfile, rejectUser, deleteUser, logAudit]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button onClick={reload} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Retry</button>
        </div>
      </div>
    );
  }

  // Render current view content
  const renderContent = () => {
    switch (view) {
      case "overview":
        return <AdminOverview users={users} firms={firms} assessments={assessments} contacts={contacts} stats={stats} />;
      case "users":
        return <AdminUsersTable users={users} firms={firms} assessments={assessments} onSelectUser={handleUserAction} appConfig={appConfig} />;
      case "user-detail":
        return selectedUser ? (
          <AdminUserDetail
            user={selectedUser}
            firms={firms}
            assessments={assessments}
            onBack={() => { setSelectedUser(null); setView("users"); }}
            onSave={updateUserProfile}
            onLogAudit={logAudit}
            onViewFirm={(f) => { setSelectedFirm(f); setView("firm-detail"); }}
            onDeleteUser={(u) => handleUserAction(u, "delete")}
          />
        ) : null;
      case "firms":
        return <AdminFirmsTable firms={firms} users={users} assessments={assessments} onSelectFirm={(f) => { setSelectedFirm(f); setView("firm-detail"); }} />;
      case "firm-detail":
        return selectedFirm ? (
          <AdminFirmDetail
            firm={selectedFirm}
            users={users}
            assessments={assessments}
            onBack={() => { setSelectedFirm(null); setView("firms"); }}
            onViewAssessment={(a) => { setSelectedAssessment(a); setView("assessment-detail"); }}
          />
        ) : null;
      case "assessment-detail":
        return selectedAssessment ? (
          <AdminAssessmentDashboard
            assessment={selectedAssessment}
            firm={firms.find(f => f.id === selectedAssessment.firm_id)}
            owner={users.find(u => u.id === selectedAssessment.user_id)}
            onBack={() => { setSelectedAssessment(null); setView(selectedFirm ? "firm-detail" : "firms"); }}
            onSaveRatings={updateAssessmentRatings}
            onLogAudit={logAudit}
          />
        ) : null;
      case "contacts":
        return <AdminContactsTable contacts={contacts} users={users} onSelectContact={(c) => { setSelectedContact(c); setView("contact-detail"); }} />;
      case "contact-detail":
        return selectedContact ? (
          <AdminContactDetail
            contact={selectedContact}
            users={users}
            onBack={() => { setSelectedContact(null); setView("contacts"); }}
            onMarkRead={markContactRead}
            onMarkUnread={markContactUnread}
            onDelete={deleteContact}
          />
        ) : null;
      case "settings":
        return <AdminSettings appConfig={appConfig} onUpdateConfig={updateAppConfig} onLogAudit={logAudit} />;
      case "audit":
        return <AdminAuditLog auditLog={auditLog} users={users} />;
      default:
        return <AdminOverview users={users} firms={firms} assessments={assessments} contacts={contacts} stats={stats} />;
    }
  };

  const currentNav = NAV_ITEMS.find(n => n.id === view) || NAV_ITEMS.find(n => n.id === view.split("-")[0]) || NAV_ITEMS[0];

  return (
    <div className="h-screen flex bg-gray-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {confirm && <ConfirmDialog {...confirm} />}

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200`}>
        {/* Logo */}
        <div className="px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">GrowthLens</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = view === item.id || view.startsWith(item.id);
            const badge = item.id === "contacts" && stats.unreadContacts > 0 ? stats.unreadContacts : item.id === "users" && stats.pendingApprovals > 0 ? stats.pendingApprovals : null;
            return (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setMobileMenuOpen(false); setSelectedUser(null); setSelectedFirm(null); setSelectedAssessment(null); setSelectedContact(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {badge != null && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-slate-700 space-y-1">
          <button onClick={() => navigate("/app")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <Eye size={18} />
            <span>Switch to User View</span>
          </button>
          <button onClick={() => reload()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <RefreshCw size={18} />
            <span>Refresh Data</span>
          </button>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1 text-gray-500 hover:text-gray-700">
              {mobileMenuOpen ? <X size={20} /> : <LayoutDashboard size={20} />}
            </button>
            <span className="text-sm font-medium text-gray-700">{currentNav.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{profile?.full_name}</span>
            <Badge color="purple">Admin</Badge>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
