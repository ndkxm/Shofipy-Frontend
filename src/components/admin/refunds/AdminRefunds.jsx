import { useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Loader2,
    RefreshCw,
    RotateCcw,
    XCircle,
} from "lucide-react";
import api from "../../../api/api";
import { Bounce, toast } from "react-toastify";

// ─── helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

const formatDate = (value) => {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

const STATUS_STYLES = {
    PENDING:   "bg-amber-50  text-amber-700  ring-1 ring-amber-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    REJECTED:  "bg-red-50    text-red-700    ring-1 ring-red-200",
};

const FILTER_OPTIONS = ["ALL", "PENDING", "COMPLETED", "REJECTED"];

// ─── main component ────────────────────────────────────────────────────────────
export const AdminRefunds = () => {
    const [refunds,    setRefunds]    = useState([]);
    const [filter,     setFilter]     = useState("PENDING");
    const [isLoading,  setIsLoading]  = useState(true);
    const [error,      setError]      = useState("");

    const fetchRefunds = async () => {
        try {
            setIsLoading(true);
            setError("");
            const { data } = await api.get("/admin/refunds");
            setRefunds(data || []);
        } catch (err) {
            setRefunds([]);
            setError(err?.response?.data?.message || "Failed to load refund requests.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchRefunds(); }, []);

    const displayed = filter === "ALL"
        ? refunds
        : refunds.filter((r) => r.status === filter);

    const counts = {
        ALL:       refunds.length,
        PENDING:   refunds.filter((r) => r.status === "PENDING").length,
        COMPLETED: refunds.filter((r) => r.status === "COMPLETED").length,
        REJECTED:  refunds.filter((r) => r.status === "REJECTED").length,
    };

    return (
        <section className="space-y-4 py-4 px-2 sm:px-0 sm:py-6">
            {/* Header */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-violet-600">
                            <RotateCcw size={15} />
                            Refund Management
                        </div>
                        <h2 className="mt-1.5 text-lg font-extrabold text-slate-950 sm:text-xl">
                            Refund Requests
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                            Review, approve, or reject user refund requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchRefunds}
                        disabled={isLoading}
                        className="inline-flex h-9 w-9 items-center justify-center self-start rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Refresh"
                    >
                        <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Filter pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {FILTER_OPTIONS.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setFilter(opt)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                                filter === opt
                                    ? "bg-violet-600 text-white shadow"
                                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {opt}
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none ${
                                filter === opt ? "bg-violet-500 text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                                {counts[opt]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <StatePanel icon={Loader2} title="Loading refunds…" spinning />
            ) : error ? (
                <StatePanel icon={AlertCircle} title="Could not load refunds" description={error} danger onRetry={fetchRefunds} />
            ) : displayed.length === 0 ? (
                <StatePanel
                    icon={RotateCcw}
                    title={`No ${filter === "ALL" ? "" : filter.toLowerCase() + " "}refund requests`}
                    description="Nothing to show here right now."
                />
            ) : (
                <div className="space-y-3">
                    {displayed.map((refund) => (
                        <RefundCard key={refund.refundId} refund={refund} onActionDone={fetchRefunds} />
                    ))}
                </div>
            )}
        </section>
    );
};

// ─── refund card ───────────────────────────────────────────────────────────────
const RefundCard = ({ refund, onActionDone }) => {
    const [expanded,   setExpanded]   = useState(false);
    const [adminNote,  setAdminNote]  = useState("");
    const [loading,    setLoading]    = useState(null); // "approve" | "reject" | null

    const isPending = refund.status === "PENDING";

    const handleApprove = async () => {
        try {
            setLoading("approve");
            await api.patch(
                `/users/${refund.userId ?? 0}/order/${refund.orderItemId}/accept-refund`,
                { adminNote: adminNote.trim() || "Approved by admin." }
            );
            toast.success("Refund approved successfully!", {
                position: "bottom-right", autoClose: 4000, theme: "light", transition: Bounce,
            });
            onActionDone?.();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to approve refund.", {
                position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce,
            });
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async () => {
        try {
            setLoading("reject");
            await api.patch(
                `/admin/orders/items/${refund.orderItemId}/reject-refund`,
                { adminNote: adminNote.trim() || "Rejected by admin." }
            );
            toast.success("Refund request rejected.", {
                position: "bottom-right", autoClose: 4000, theme: "light", transition: Bounce,
            });
            onActionDone?.();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to reject refund.", {
                position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce,
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* Card header row */}
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                    {/* Status dot */}
                    <div className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                        refund.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600"
                        : refund.status === "REJECTED" ? "bg-red-50 text-red-500"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                        {refund.status === "COMPLETED" ? <CheckCircle2 size={16} />
                         : refund.status === "REJECTED" ? <XCircle size={16} />
                         : <RotateCcw size={16} />}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-extrabold text-slate-900 truncate max-w-[260px]">
                                {refund.productName || "Unknown product"}
                            </p>
                            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[refund.status] || "bg-slate-100 text-slate-600"}`}>
                                {refund.status}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 truncate">
                            <span className="font-semibold text-slate-700">{refund.username || refund.userEmail}</span>
                            {" · "}Order #{refund.orderId}
                            {" · "}Item #{refund.orderItemId}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">{formatDate(refund.refundDate)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-base font-extrabold text-slate-900">{formatCurrency(refund.amount)}</p>
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100"
                        aria-label={expanded ? "Collapse" : "Expand"}
                    >
                        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                </div>
            </div>

            {/* Expanded detail panel */}
            {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 space-y-4">
                    {/* Reason */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">User reason</p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {refund.reason || <span className="italic text-slate-400">No reason provided.</span>}
                        </p>
                    </div>

                    {/* Admin note (read-only if not pending) */}
                    {!isPending && refund.adminNote && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Admin note</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{refund.adminNote}</p>
                        </div>
                    )}

                    {/* Stripe refund ID */}
                    {refund.stripeRefundId && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Stripe refund ID</p>
                            <p className="font-mono text-xs text-slate-600">{refund.stripeRefundId}</p>
                        </div>
                    )}

                    {/* Action area – only for PENDING */}
                    {isPending && (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1 block">
                                    Admin note <span className="text-slate-300 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    rows={2}
                                    placeholder="Leave a note for the user…"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                {/* Approve */}
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    disabled={!!loading}
                                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading === "approve" ? (
                                        <Loader2 size={15} className="animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={15} />
                                    )}
                                    Approve &amp; Refund
                                </button>

                                {/* Reject */}
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    disabled={!!loading}
                                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading === "reject" ? (
                                        <Loader2 size={15} className="animate-spin" />
                                    ) : (
                                        <XCircle size={15} />
                                    )}
                                    Reject
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── state panel ───────────────────────────────────────────────────────────────
const StatePanel = ({ icon: Icon, title, description, danger = false, spinning = false, onRetry }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${danger ? "bg-red-50 text-red-500" : "bg-violet-50 text-violet-600"}`}>
            <Icon size={22} className={spinning ? "animate-spin" : ""} />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-slate-900">{title}</h3>
        {description && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">{description}</p>}
        {onRetry && (
            <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700"
            >
                <RefreshCw size={15} />
                Try again
            </button>
        )}
    </div>
);
