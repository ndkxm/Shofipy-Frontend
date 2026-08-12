import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    Search,
    Shield,
    User,
    Users,
    X,
} from "lucide-react";
import api from "../../../api/api";


// ─── constants ─────────────────────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const SORT_OPTIONS = [
    { label: "Username A→Z", sortBy: "username", sortOrder: "asc" },
    { label: "Username Z→A", sortBy: "username", sortOrder: "desc" },
    { label: "Newest first",  sortBy: "createdAt", sortOrder: "desc" },
    { label: "Oldest first",  sortBy: "createdAt", sortOrder: "asc" },
];

// ─── helpers ───────────────────────────────────────────────────────────────
const formatDate = (v) => {
    if (!v) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short", day: "2-digit", year: "numeric",
    }).format(new Date(v));
};

const getRoleBadge = (role = "") => {
    const isAdmin = role?.includes("ADMIN");
    return isAdmin
        ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
        : "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
};

const getRoleLabel = (role = "") =>
    role?.includes("ADMIN") ? "Admin" : "User";

// ─── sub-components ────────────────────────────────────────────────────────
const Avatar = ({ src, username }) => {
    const initials = (username || "?").slice(0, 2).toUpperCase();
    return src ? (
        <img
            src={src}
            alt={username}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
        />
    ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white ring-2 ring-slate-100">
            {initials}
        </div>
    );
};

// ─── main component ────────────────────────────────────────────────────────
export const StaffUsers = () => {
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
            const msg = err?.response?.data?.message || "Failed to load users.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [pageNumber, pageSize, sortBy, sortOrder, keyword]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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

    // ── render ─────────────────────────────────────────────────────────────
    return (
        <section className="space-y-5 py-6">
            {/* toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* search */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                            id="admin-user-search"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Search by username…"
                            className="h-10 w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {inputValue && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </form>

                {/* sort + page size + refresh */}
                <div className="flex items-center gap-2">
                    <select
                        value={sortIdx}
                        onChange={(e) => { setSortIdx(Number(e.target.value)); setPageNumber(0); }}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {SORT_OPTIONS.map((o, i) => (
                            <option key={i} value={i}>{o.label}</option>
                        ))}
                    </select>

                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(0); }}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {PAGE_SIZE_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s} / page</option>
                        ))}
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
                </div>
            </div>

            {/* summary */}
            {!isLoading && !error && (
                <p className="text-xs font-medium text-slate-500">
                    {totalElements > 0
                        ? `${totalElements} user${totalElements !== 1 ? "s" : ""} found`
                        : keyword ? "No users matched your search." : "No users yet."}
                </p>
            )}

            {/* loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={30} />
                </div>
            )}

            {/* error */}
            {!isLoading && error && (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <AlertCircle size={28} className="text-red-400" />
                        <p className="text-sm font-semibold text-slate-700">{error}</p>
                        <button
                            onClick={fetchUsers}
                            className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* empty */}
            {!isLoading && !error && users.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <Users size={36} className="text-slate-300" />
                    <p className="text-sm font-semibold text-slate-500">
                        {keyword ? `No users found for "${keyword}"` : "No users in the system yet."}
                    </p>
                    {keyword && (
                        <button
                            onClick={handleClearSearch}
                            className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            )}

            {/* table */}
            {!isLoading && !error && users.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="transition hover:bg-slate-50/60">
                                    {/* user */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={user.avatar} username={user.username} />
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {user.username}
                                                </p>
                                                <p className="text-xs text-slate-400">ID #{user.id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* email */}
                                    <td className="px-4 py-3 text-slate-600">
                                        {user.email}
                                    </td>

                                    {/* role */}
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadge(user.role)}`}>
                                            {user.role?.includes("ADMIN")
                                                ? <Shield size={11} />
                                                : <User size={11} />
                                            }
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </td>

                                    {/* joined */}
                                    <td className="px-4 py-3 text-slate-500">
                                        {formatDate(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* pagination */}
            {!isLoading && !error && totalPages > 1 && (
                <PaginationBar
                    pageNumber={pageNumber}
                    totalPages={totalPages}
                    onPage={setPageNumber}
                />
            )}
        </section>
    );
};

// ─── inline pagination ──────────────────────────────────────────────────────
const PaginationBar = ({ pageNumber, totalPages, onPage }) => {
    const pages = buildPages(pageNumber, totalPages);
    return (
        <div className="flex items-center justify-center gap-1.5 pt-2">
            <PageBtn
                onClick={() => onPage(pageNumber - 1)}
                disabled={pageNumber === 0}
                label="Prev"
            >
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

            <PageBtn
                onClick={() => onPage(pageNumber + 1)}
                disabled={pageNumber >= totalPages - 1}
                label="Next"
            >
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
