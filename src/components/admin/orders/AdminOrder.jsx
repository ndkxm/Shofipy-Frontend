import { useEffect, useState } from "react";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    ClipboardList,
    Loader2,
    PackageOpen,
    RefreshCw,
    Search,
    X,
} from "lucide-react";
import api from "../../../api/api";
import { Bounce, toast } from "react-toastify";

const SORT_OPTIONS = [
    { label: "Newest first", sortBy: "orderDate", sortOrder: "desc" },
    { label: "Oldest first", sortBy: "orderDate", sortOrder: "asc" },
    { label: "Highest amount", sortBy: "totalAmount", sortOrder: "desc" },
    { label: "Lowest amount", sortBy: "totalAmount", sortOrder: "asc" },
];

const ORDER_STATUS_OPTIONS = [
    { label: "PENDING_PAYMENT" },
    { label: "PAID" },
    { label: "CANCELLED" },
    { label: "EXPIRED" },
    { label: "PROCESSING" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const formatCurrency = (value, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (currency || "USD").toUpperCase(),
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

const formatDate = (value) => {
    if (!value) return "No date";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(new Date(value));
};

const getStatusClass = (status = "") => {
    const normalized = status.toUpperCase();
    if (normalized.includes("PAID") || normalized.includes("ACCEPTED") || normalized.includes("DELIVERED"))
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    if (normalized.includes("PENDING") || normalized.includes("PROCESSING") || normalized.includes("SHIPPED"))
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    if (normalized.includes("CANCEL") || normalized.includes("EXPIRED"))
        return "bg-red-50 text-red-700 ring-1 ring-red-200";
    return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
};

export const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    });
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState(SORT_OPTIONS[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError("");
            const { data } = await api.get("/admin/orders", {
                params: {
                    pageNumber,
                    pageSize,
                    sortBy: sortConfig.sortBy,
                    sortOrder: sortConfig.sortOrder,
                    keyword: keyword || undefined,
                },
            });
            setOrders(data?.content || []);
            setPagination({
                pageNumber: data?.pageNumber ?? 0,
                pageSize: data?.pageSize ?? pageSize,
                totalElements: data?.totalElements ?? 0,
                totalPages: data?.totalPages ?? 0,
                lastPage: Boolean(data?.lastPage),
            });
        } catch (err) {
            setOrders([]);
            setPagination((p) => ({ ...p, totalElements: 0, totalPages: 0, lastPage: true }));
            setError(err?.response?.data?.message || "Failed to load orders.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pageNumber, pageSize, sortConfig, keyword]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setKeyword(searchTerm.trim());
        setPageNumber(0);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setKeyword("");
        setPageNumber(0);
    };

    const handleSortChange = (e) => {
        setSortConfig(SORT_OPTIONS.find((o) => o.label === e.target.value) || SORT_OPTIONS[0]);
        setPageNumber(0);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setPageNumber(0);
    };

    const canGoPrevious = pageNumber > 0 && !isLoading;
    const canGoNext = !pagination.lastPage && !isLoading;

    return (
        <section className="space-y-4 py-4 px-2 sm:px-0 sm:py-6">
            {/* Header card */}
            <div className="rounded-lg border border-slate-900 bg-white p-4">
                <div className="flex flex-col gap-4">
                    {/* Title */}
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-600">
                            <ClipboardList size={15} />
                            Admin orders
                        </div>
                        <h2 className="mt-1.5 text-lg font-extrabold text-slate-950 sm:text-xl">All orders</h2>
                        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                            Manage and update order statuses in real time.
                        </p>
                    </div>

                    {/* Controls */}
                    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        {/* Search */}
                        <label className="relative flex-1 min-w-[180px]">
                            <Search
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={15}
                            />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search order ID, email, status…"
                                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </label>

                        {/* Sort */}
                        <label className="relative flex-1 min-w-[160px]">
                            <ChevronsUpDown
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={15}
                            />
                            <select
                                value={sortConfig.label}
                                onChange={handleSortChange}
                                className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.label} value={o.label}>{o.label}</option>
                                ))}
                            </select>
                        </label>

                        {/* Page size */}
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                            {PAGE_SIZE_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s} / page</option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="inline-flex h-9 flex-1 sm:flex-none items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={fetchOrders}
                                disabled={isLoading}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-900 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label="Refresh"
                            >
                                <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <StatePanel icon={Loader2} title="Loading orders…" spinning />
            ) : error ? (
                <StatePanel icon={AlertCircle} title="Could not load orders" description={error} danger onRetry={fetchOrders} />
            ) : orders.length === 0 ? (
                <StatePanel icon={PackageOpen} title="No orders found" description="Try a different search term or refresh the list." />
            ) : (
                <div className="overflow-hidden rounded-lg border border-slate-900 bg-white">
                    {/* Desktop table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-left">
                            <thead className="bg-slate-100 border-b border-slate-900">
                                <tr>
                                    {["Order", "Customer", "Date", "Items", "Status", "Payment", "Total"].map((h, i) => (
                                        <th
                                            key={h}
                                            className={`whitespace-nowrap px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 ${i === 6 ? "text-right" : ""}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {orders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                                            <p className="font-extrabold text-slate-900">#{order.orderId}</p>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                                            <p className="max-w-[200px] truncate font-semibold text-slate-700">{order.user.email || "Unknown"}</p>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
                                            {formatDate(order.orderDate)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                                            <OrderItems items={order.orderItems} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                                            <StatusPill orderId={order.orderId} value={order.orderStatus} onUpdated={fetchOrders} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                                            <p className="font-semibold text-slate-700">{order.payment?.pgName || "N/A"}</p>
                                            <p className="mt-0.5 text-xs text-slate-400">{order.payment?.pgStatus || "No status"}</p>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm text-right">
                                            <p className="font-extrabold text-slate-900">{formatCurrency(order.totalAmount, order.currency)}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="lg:hidden divide-y divide-slate-100">
                        {orders.map((order) => (
                            <div key={order.orderId} className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-extrabold text-slate-900 text-sm">#{order.orderId}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.orderDate)}</p>
                                    </div>
                                    <p className="font-extrabold text-slate-900 text-sm">{formatCurrency(order.totalAmount, order.currency)}</p>
                                </div>

                                <p className="text-sm text-slate-600 truncate">{order.user.email || "Unknown"}</p>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <StatusPill orderId={order.orderId} value={order.orderStatus} onUpdated={fetchOrders} />
                                    {order.payment?.pgName && (
                                        <span className="text-xs text-slate-500 bg-slate-100 rounded-md px-2 py-0.5">
                                            {order.payment.pgName}
                                        </span>
                                    )}
                                </div>

                                <OrderItems items={order.orderItems} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-medium text-slate-400">
                            Page {pagination.totalPages === 0 ? 0 : pagination.pageNumber + 1} of {pagination.totalPages} · {pagination.totalElements} orders
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
                                disabled={!canGoPrevious}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => setPageNumber((p) => p + 1)}
                                disabled={!canGoNext}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

const StatusPill = ({ orderId, value, onUpdated }) => {
    const [status, setStatus] = useState(value);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e) => {
        const newStatus = e.target.value;
        try {
            setLoading(true);
            // Backend reads status as a query param (@RequestParam), not from the body.
            await api.patch(`/admin/orders/${orderId}/status`, null, { params: { status: newStatus } });
            setStatus(newStatus);
            onUpdated?.(newStatus);
        } catch (error) {
            const data = error.response?.data;
            toast.error(data?.message || data, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <select
            disabled={loading}
            value={status}
            onChange={handleChange}
            className={`rounded-lg px-2 py-1 text-xs font-bold cursor-pointer outline-none transition ${getStatusClass(status)}`}
        >
            {ORDER_STATUS_OPTIONS.map((o) => (
                <option key={o.label} value={o.label}>{o.label}</option>
            ))}
        </select>
    );
};

const OrderItems = ({ items = [] }) => {
    if (!items.length) return <span className="text-xs text-slate-400">No items</span>;
    const first = items[0];
    const remaining = items.length - 1;
    return (
        <div>
            <p className="max-w-[200px] truncate text-sm font-semibold text-slate-700">
                {first?.product?.productName || "Product"} × {first?.quantity || 0}
            </p>
            {remaining > 0 && (
                <p className="mt-0.5 text-xs text-slate-400">+{remaining} more item{remaining > 1 ? "s" : ""}</p>
            )}
        </div>
    );
};

const StatePanel = ({ icon: Icon, title, description, danger = false, spinning = false, onRetry }) => (
    <div className="rounded-lg border border-slate-900 bg-white p-10 text-center">
        <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-md ${danger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}>
            <Icon size={22} className={spinning ? "animate-spin" : ""} />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-slate-900">{title}</h3>
        {description && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">{description}</p>}
        {onRetry && (
            <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700"
            >
                <RefreshCw size={15} />
                Try again
            </button>
        )}
    </div>
);