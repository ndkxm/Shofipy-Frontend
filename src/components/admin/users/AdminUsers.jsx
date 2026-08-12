import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    Search,
    Shield,
    ShieldCheck,
    Trash2,
    User,
    UserCog,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import api from "../../../api/api";
import { Bounce, toast } from "react-toastify";

// ─── constants ─────────────────────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const SORT_OPTIONS = [
    { label: "Username A→Z", sortBy: "username", sortOrder: "asc" },
    { label: "Username Z→A", sortBy: "username", sortOrder: "desc" },
    { label: "Newest first",  sortBy: "createdAt", sortOrder: "desc" },
    { label: "Oldest first",  sortBy: "createdAt", sortOrder: "asc" },
];

const ROLES = [
    { value: "user",  label: "User",  icon: User,       color: "bg-blue-50 text-blue-700 ring-blue-200" },
    { value: "admin", label: "Admin", icon: ShieldCheck, color: "bg-purple-50 text-purple-700 ring-purple-200" },
    { value: "staff", label: "Staff", icon: Shield,      color: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
];

// ─── helpers ───────────────────────────────────────────────────────────────
const showToast = (msg) =>
    toast.error(msg, { position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce });
const showSuccess = (msg) =>
    toast.success(msg, { position: "bottom-right", autoClose: 3000, theme: "light", transition: Bounce });

const formatDate = (v) => {
    if (!v) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short", day: "2-digit", year: "numeric",
    }).format(new Date(v));
};

const getRoleInfo = (roleStr = "") => {
    if (roleStr?.includes("ADMIN")) return ROLES[1];
    if (roleStr?.includes("STAFF")) return ROLES[2];
    return ROLES[0];
};

// ─── sub-components ────────────────────────────────────────────────────────
const Avatar = ({ src, username }) => {
    const initials = (username || "?").slice(0, 2).toUpperCase();
    return src ? (
        <img src={src} alt={username} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100" />
    ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white ring-2 ring-slate-100">
            {initials}
        </div>
    );
};

const RoleBadge = ({ role }) => {
    const info = getRoleInfo(role);
    const Icon = info.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${info.color}`}>
            <Icon size={11} />
            {info.label}
        </span>
    );
};

// ─── main component ────────────────────────────────────────────────────────
export const AdminUsers = () => {
    const [users, setUsers]             = useState([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [error, setError]             = useState("");
    const [keyword, setKeyword]         = useState("");
    const [inputValue, setInputValue]   = useState("");
    const [sortIdx, setSortIdx]         = useState(0);
    const [pageNumber, setPageNumber]   = useState(0);
    const [pageSize, setPageSize]       = useState(10);
    const [totalPages, setTotalPages]   = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // ── Role modal state ──
    const [roleModal, setRoleModal]       = useState(null);
    const [selectedRole, setSelectedRole] = useState("user");
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    // ── Create user modal state ──
    const [createModal, setCreateModal]   = useState(false);
    const [createForm, setCreateForm]     = useState({ username: "", email: "", password: "", role: "user" });
    const [createErrors, setCreateErrors] = useState({});
    const [isCreating, setIsCreating]     = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ── Selection & delete state ──
    const [selectedIds, setSelectedIds]   = useState(new Set());
    const [deleteModal, setDeleteModal]   = useState(null); // { type: "single" | "bulk", userId?: number }
    const [isDeleting, setIsDeleting]     = useState(false);

    const { sortBy, sortOrder } = SORT_OPTIONS[sortIdx];

    // ── fetch ──────────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const params = { pageNumber, pageSize, sortBy, sortOrder };
            if (keyword) params.keyword = keyword;
            const { data } = await api.get("/admin/users", { params });
            setUsers(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load users.");
        } finally {
            setIsLoading(false);
        }
    }, [pageNumber, pageSize, sortBy, sortOrder, keyword]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // Clear selection when page changes
    useEffect(() => { setSelectedIds(new Set()); }, [pageNumber, pageSize, sortBy, sortOrder, keyword]);

    // ── search ─────────────────────────────────────────────────────────────
    const handleSearch = (e) => {
        e.preventDefault();
        setPageNumber(0);
        setKeyword(inputValue.trim());
    };

    const handleClearSearch = () => {
        setInputValue("");
        setKeyword("");
        setPageNumber(0);
    };

    // ── Selection helpers ───────────────────────────────────────────────────
    const isAllSelected = users.length > 0 && users.every((u) => selectedIds.has(u.id));
    const isIndeterminate = users.some((u) => selectedIds.has(u.id)) && !isAllSelected;

    const toggleAll = () => {
        if (isAllSelected) {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                users.forEach((u) => next.delete(u.id));
                return next;
            });
        } else {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                users.forEach((u) => next.add(u.id));
                return next;
            });
        }
    };

    const toggleUser = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // ── Role modal ─────────────────────────────────────────────────────────
    const openRoleModal = (user) => {
        setSelectedRole(getRoleInfo(user.role).value);
        setRoleModal({ user });
    };

    const handleUpdateRole = async () => {
        if (!roleModal) return;
        setIsUpdatingRole(true);
        try {
            await api.put(`/admin/users/${roleModal.user.id}/role`, { role: selectedRole });
            showSuccess(`Role updated to "${selectedRole}" for ${roleModal.user.username}`);
            setRoleModal(null);
            fetchUsers();
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to update role.");
        } finally {
            setIsUpdatingRole(false);
        }
    };

    // ── Create user ─────────────────────────────────────────────────────────
    const openCreateModal = () => {
        setCreateForm({ username: "", email: "", password: "", role: "user" });
        setCreateErrors({});
        setShowPassword(false);
        setCreateModal(true);
    };

    const validateCreate = () => {
        const errs = {};
        if (!createForm.username.trim() || createForm.username.length < 3)
            errs.username = "Tối thiểu 3 ký tự";
        if (!createForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email))
            errs.email = "Email không hợp lệ";
        if (!createForm.password || createForm.password.length < 8)
            errs.password = "Tối thiểu 8 ký tự";
        return errs;
    };

    const handleCreate = async () => {
        const errs = validateCreate();
        if (Object.keys(errs).length) { setCreateErrors(errs); return; }
        setIsCreating(true);
        try {
            await api.post("/admin/users", createForm);
            showSuccess(`User "${createForm.username}" created successfully!`);
            setCreateModal(false);
            fetchUsers();
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to create user.");
        } finally {
            setIsCreating(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────
    const openDeleteSingle = (user) => setDeleteModal({ type: "single", user });
    const openDeleteBulk   = () => setDeleteModal({ type: "bulk" });

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (deleteModal.type === "single") {
                await api.delete(`/admin/users/${deleteModal.user.id}`);
                showSuccess(`User "${deleteModal.user.username}" deleted.`);
                setSelectedIds((prev) => { const n = new Set(prev); n.delete(deleteModal.user.id); return n; });
            } else {
                const ids = Array.from(selectedIds);
                await api.delete("/admin/users/bulk", { data: { userIds: ids } });
                showSuccess(`${ids.length} user(s) deleted.`);
                setSelectedIds(new Set());
            }
            setDeleteModal(null);
            fetchUsers();
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to delete user(s).");
        } finally {
            setIsDeleting(false);
        }
    };

    // ── render ─────────────────────────────────────────────────────────────
    return (
        <section className="space-y-5 py-6">
            {/* toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            id="admin-user-search"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Search by username…"
                            className="h-10 w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {inputValue && (
                            <button type="button" onClick={handleClearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <button type="submit" className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition">
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2">
                    <select
                        value={sortIdx}
                        onChange={(e) => { setSortIdx(Number(e.target.value)); setPageNumber(0); }}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {SORT_OPTIONS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
                    </select>

                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(0); }}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} / page</option>)}
                    </select>

                    <button
                        type="button"
                        onClick={fetchUsers}
                        disabled={isLoading}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                        title="Refresh"
                    >
                        <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                    </button>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                    >
                        <UserPlus size={15} />
                        Add User
                    </button>
                </div>
            </div>

            {/* bulk-action bar */}
            {selectedIds.size > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
                    <span className="text-sm font-semibold text-red-700">
                        {selectedIds.size} user{selectedIds.size !== 1 ? "s" : ""} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                        >
                            Deselect all
                        </button>
                        <button
                            onClick={openDeleteBulk}
                            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
                        >
                            <Trash2 size={13} />
                            Delete selected
                        </button>
                    </div>
                </div>
            )}

            {/* summary */}
            {!isLoading && !error && (
                <p className="text-xs font-medium text-slate-500">
                    {totalElements > 0
                        ? `${totalElements} user${totalElements !== 1 ? "s" : ""} found`
                        : keyword ? "No users matched your search." : "No users yet."}
                </p>
            )}

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={30} />
                </div>
            )}

            {!isLoading && error && (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <AlertCircle size={28} className="text-red-400" />
                        <p className="text-sm font-semibold text-slate-700">{error}</p>
                        <button onClick={fetchUsers} className="text-sm font-semibold text-blue-600 hover:underline">Try again</button>
                    </div>
                </div>
            )}

            {!isLoading && !error && users.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <Users size={36} className="text-slate-300" />
                    <p className="text-sm font-semibold text-slate-500">
                        {keyword ? `No users found for "${keyword}"` : "No users in the system yet."}
                    </p>
                    {keyword && (
                        <button onClick={handleClearSearch} className="text-sm font-semibold text-blue-600 hover:underline">Clear search</button>
                    )}
                </div>
            )}

            {/* table */}
            {!isLoading && !error && users.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="w-10 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        id="select-all-users"
                                        checked={isAllSelected}
                                        ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                                        onChange={toggleAll}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">User</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Joined</th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => {
                                const isChecked = selectedIds.has(user.id);
                                return (
                                    <tr
                                        key={user.id}
                                        className={`group transition hover:bg-slate-50/60 ${isChecked ? "bg-blue-50/40" : ""}`}
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleUser(user.id)}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar src={user.avatar} username={user.username} />
                                                <div>
                                                    <p className="font-semibold text-slate-800">{user.username}</p>
                                                    <p className="text-xs text-slate-400">ID #{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{user.email}</td>
                                        <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                                        <td className="px-4 py-3 text-slate-500">{formatDate(user.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openRoleModal(user)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition hover:border-indigo-300 hover:text-indigo-600"
                                                >
                                                    <UserCog size={13} /> Change Role
                                                </button>
                                                <button
                                                    onClick={() => openDeleteSingle(user)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                                    title="Delete user"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* pagination */}
            {!isLoading && !error && totalPages > 1 && (
                <PaginationBar pageNumber={pageNumber} totalPages={totalPages} onPage={setPageNumber} />
            )}

            {/* ────────────── Change Role Modal ────────────── */}
            {roleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setRoleModal(null)} />
                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
                        {/* header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                    <UserCog size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">Change Role</h3>
                                    <p className="text-xs text-slate-500">{roleModal.user.username}</p>
                                </div>
                            </div>
                            <button onClick={() => setRoleModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* body */}
                        <div className="px-6 py-5">
                            <p className="mb-4 text-sm font-semibold text-slate-700">Select new role:</p>
                            <div className="grid grid-cols-3 gap-3">
                                {ROLES.map((r) => {
                                    const Icon = r.icon;
                                    const isSelected = selectedRole === r.value;
                                    return (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setSelectedRole(r.value)}
                                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                                                isSelected ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                                                <Icon size={18} />
                                            </div>
                                            <span className={`text-xs font-semibold ${isSelected ? "text-indigo-700" : "text-slate-600"}`}>{r.label}</span>
                                            {isSelected && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                                ⚠️ Changing a user's role will affects their access permissions..
                            </div>
                        </div>

                        {/* footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                            <button onClick={() => setRoleModal(null)} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateRole}
                                disabled={isUpdatingRole}
                                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition"
                            >
                                {isUpdatingRole ? <Loader2 size={14} className="animate-spin" /> : null}
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ────────────── Create User Modal ────────────── */}
            {createModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setCreateModal(false)} />
                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
                        {/* header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    <UserPlus size={20} />
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900">Create New User</h3>
                            </div>
                            <button onClick={() => setCreateModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* body */}
                        <div className="space-y-4 px-6 py-5">
                            {/* Username */}
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Username <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.username}
                                    onChange={(e) => {
                                        setCreateForm((p) => ({ ...p, username: e.target.value }));
                                        setCreateErrors((p) => ({ ...p, username: "" }));
                                    }}
                                    placeholder="Enter username..."
                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                                        createErrors.username ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    }`}
                                />
                                {createErrors.username && <p className="mt-1 text-xs text-red-500">{createErrors.username}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={createForm.email}
                                    onChange={(e) => {
                                        setCreateForm((p) => ({ ...p, email: e.target.value }));
                                        setCreateErrors((p) => ({ ...p, email: "" }));
                                    }}
                                    placeholder="user@example.com"
                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                                        createErrors.email ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    }`}
                                />
                                {createErrors.email && <p className="mt-1 text-xs text-red-500">{createErrors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Password <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={createForm.password}
                                        onChange={(e) => {
                                            setCreateForm((p) => ({ ...p, password: e.target.value }));
                                            setCreateErrors((p) => ({ ...p, password: "" }));
                                        }}
                                        placeholder="Min. 8 characters"
                                        className={`w-full rounded-xl border px-4 py-2.5 pr-16 text-sm outline-none transition-all ${
                                            createErrors.password ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {createErrors.password && <p className="mt-1 text-xs text-red-500">{createErrors.password}</p>}
                            </div>

                            {/* Role selector */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {ROLES.map((r) => {
                                        const Icon = r.icon;
                                        const isSelected = createForm.role === r.value;
                                        return (
                                            <button
                                                key={r.value}
                                                type="button"
                                                onClick={() => setCreateForm((p) => ({ ...p, role: r.value }))}
                                                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 transition-all ${
                                                    isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"
                                                }`}
                                            >
                                                <Icon size={16} className={isSelected ? "text-emerald-600" : "text-slate-400"} />
                                                <span className={`text-xs font-semibold ${isSelected ? "text-emerald-700" : "text-slate-500"}`}>{r.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                            <button
                                onClick={() => setCreateModal(false)}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isCreating}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition"
                            >
                                {isCreating ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ────────────── Delete Confirm Modal ────────────── */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteModal(null)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl">
                        {/* header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                    <Trash2 size={20} />
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900">
                                    {deleteModal.type === "single" ? "Delete User" : "Delete Users"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setDeleteModal(null)}
                                disabled={isDeleting}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-40"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* body */}
                        <div className="px-6 py-5">
                            {deleteModal.type === "single" ? (
                                <p className="text-sm text-slate-600">
                                    Are you sure you want to delete{" "}
                                    <span className="font-bold text-slate-900">"{deleteModal.user.username}"</span>?
                                    This action cannot be undone.
                                </p>
                            ) : (
                                <p className="text-sm text-slate-600">
                                    Are you sure you want to delete{" "}
                                    <span className="font-bold text-slate-900">{selectedIds.size} user{selectedIds.size !== 1 ? "s" : ""}</span>?
                                    This action cannot be undone.
                                </p>
                            )}
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                ⚠️ All associated sessions and data will be permanently removed.
                            </div>
                        </div>

                        {/* footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                            <button
                                onClick={() => setDeleteModal(null)}
                                disabled={isDeleting}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition"
                            >
                                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

// ─── inline pagination ──────────────────────────────────────────────────────
const PaginationBar = ({ pageNumber, totalPages, onPage }) => {
    const pages = buildPages(pageNumber, totalPages);
    return (
        <div className="flex items-center justify-center gap-1.5 pt-2">
            <PageBtn onClick={() => onPage(pageNumber - 1)} disabled={pageNumber === 0} label="Prev">
                <ChevronLeft size={14} />
            </PageBtn>
            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`d-${i}`} className="px-1 text-slate-400 text-sm">···</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPage(p)}
                        className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
                            p === pageNumber
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {p + 1}
                    </button>
                )
            )}
            <PageBtn onClick={() => onPage(pageNumber + 1)} disabled={pageNumber >= totalPages - 1} label="Next">
                <ChevronRight size={14} />
            </PageBtn>
        </div>
    );
};

const PageBtn = ({ children, onClick, disabled, label }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
        {children}
    </button>
);

const buildPages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const pages = [];
    const add = (p) => { if (!pages.includes(p) && p >= 0 && p < total) pages.push(p); };
    [0, 1, current - 1, current, current + 1, total - 2, total - 1].forEach(add);
    pages.sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < pages.length; i++) {
        if (i > 0 && pages[i] - pages[i - 1] > 1) result.push("...");
        result.push(pages[i]);
    }
    return result;
};
