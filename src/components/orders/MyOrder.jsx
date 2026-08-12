import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    ChevronUp,
    Copy,
    Eye,
    EyeOff,
    Key,
    Loader2,
    PackageOpen,
    RefreshCw,
    Search,
    ShoppingBag,
    Tag,
    X,
    XCircle,
    RotateCcw,
    CheckCircle2,
    Clock,
    AlertTriangle,
} from "lucide-react";
import api from "../../api/api";
import { Bounce, toast } from "react-toastify";
import { parseImages } from "../utils/ParseImages";
import { Header } from "../shared/Header";
import { useSelector } from "react-redux";

/* ─────────────── helpers ─────────────── */
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
    const n = String(status || "").toUpperCase();
    if (n === "PAID" || n === "DELIVERED")
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    if (n === "PENDING_PAYMENT" || n === "PROCESSING" || n === "SHIPPED")
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    if (n === "CANCELLED" || n === "EXPIRED")
        return "bg-red-50 text-red-700 ring-1 ring-red-200";
    return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
};

const statusLabel = (status = "") =>
    String(status || "UNKNOWN").replaceAll("_", " ");

const getRefundBadge = (refundStatus) => {
    if (!refundStatus) return null;
    const n = String(refundStatus).toUpperCase();
    if (n === "PENDING")
        return { label: "Refund Pending", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", Icon: Clock };
    if (n === "COMPLETED")
        return { label: "Refunded", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", Icon: CheckCircle2 };
    if (n === "REJECTED")
        return { label: "Refund Rejected", className: "bg-red-50 text-red-700 ring-1 ring-red-200", Icon: XCircle };
    return null;
};

/* ─────────────── Refund Modal ─────────────── */
const RefundModal = ({ item, order, onClose, onSuccess }) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const textareaRef = useRef(null);

    useEffect(() => { textareaRef.current?.focus(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return;
        try {
            setIsSubmitting(true);
            await api.patch(
                `/users/${user.id}/order/${item.orderItemId}/request-refund`,
                { reason: reason.trim() }
            );
            toast.success("Refund request submitted successfully!", {
                position: "bottom-right", autoClose: 3000, theme: "light", transition: Bounce,
            });
            onSuccess(item.orderItemId);
            onClose();
            location.reload();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to submit refund request.", {
                position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const itemImage = item.product?.thumbnail;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-[fadeInUp_0.2s_ease]">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <RotateCcw size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900">Request Refund</h3>
                            <p className="text-xs text-slate-400">Order #{order.orderId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {itemImage ? (
                            <img src={itemImage} alt={item.product?.productName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300"><ShoppingBag size={20} /></div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{item.product?.productName || "Product"}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(item.orderedProductPrice, order.currency)}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Reason for refund <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        ref={textareaRef}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please describe why you want a refund..."
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="mt-1.5 text-xs text-slate-400">
                        Note: You can only request a refund if you have not revealed the game key.
                    </p>
                    <div className="mt-5 flex gap-3">
                        <button type="button" onClick={onClose}
                            className="flex-1 h-11 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={!reason.trim() || isSubmitting}
                            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />}
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────── Reveal Key Warning Modal ─────────────── */
const RevealKeyModal = ({ item, order, onClose, onRevealed }) => {
    const [isRevealing, setIsRevealing] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const handleReveal = async () => {
        if (item.refundStatus) {
            toast.error("Cannot reveal because it in refund process", {
                position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce,
            });
        }
        try {
            setIsRevealing(true);
            const { data } = await api.patch(
                `/users/${user.id}/order/${item.orderItemId}/reveal-key`
            );
            onRevealed(item.orderItemId, data);
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to reveal game key.", {
                position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce,
            });
        } finally {
            setIsRevealing(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={(e) => e.target === e.currentTarget && !isRevealing && onClose()}
        >
            <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-[fadeInUp_0.2s_ease]">
                {/* Warning Header */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-6 py-6 text-center text-white">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <AlertTriangle size={28} />
                    </div>
                    <h3 className="text-lg font-extrabold">Reveal Game Key?</h3>
                    <p className="mt-1 text-sm text-amber-100">This action cannot be undone</p>
                </div>

                {/* Product info */}
                <div className="px-6 pt-5">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-200">
                        <Key size={16} className="shrink-0 text-slate-500" />
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {item.product?.productName || "Product"}
                        </p>
                    </div>
                </div>

                {/* Warning list */}
                <div className="px-6 py-5 space-y-3">
                    <p className="text-sm font-bold text-slate-800">⚠️ Before you reveal, please note:</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">✕</span>
                            <span>Once revealed, you <strong>cannot request a refund</strong> for this item.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>The key will be permanently visible every time you view this page.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>Keep your key safe — it is unique to you.</span>
                        </li>
                    </ul>
                </div>

                <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isRevealing}
                        className="flex-1 h-11 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleReveal}
                        disabled={isRevealing}
                        className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isRevealing ? <Loader2 size={15} className="animate-spin" /> : <Eye size={15} />}
                        Yes, Reveal Key
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────── Game Key Display ─────────────── */
const AUTO_HIDE_SECONDS = 30;

const GameKeySection = ({ item, order }) => {
    const { user } = useSelector((state) => state.auth);
    const [showRevealModal, setShowRevealModal] = useState(false);
    const [revealedKey, setRevealedKey] = useState(null); // Không pre-load key vào state
    const [showKey, setShowKey] = useState(false);
    const [isFetchingKey, setIsFetchingKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const [autoHideCountdown, setAutoHideCountdown] = useState(null);
    const autoHideTimerRef = useRef(null);
    const countdownRef = useRef(null);

    const isRevealed = item.revealed || !!revealedKey;

    const clearKeyFromMemory = () => {
        setShowKey(false);
        setRevealedKey(null); 
        setCopied(false);
    };

    useEffect(() => {
        if (showKey) {
            setAutoHideCountdown(AUTO_HIDE_SECONDS);

            countdownRef.current = setInterval(() => {
                setAutoHideCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownRef.current);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);

            autoHideTimerRef.current = setTimeout(() => {
                clearKeyFromMemory();
                setAutoHideCountdown(null);
            }, AUTO_HIDE_SECONDS * 1000);
        } else {
            clearTimeout(autoHideTimerRef.current);
            clearInterval(countdownRef.current);
            setAutoHideCountdown(null);
        }

        return () => {
            clearTimeout(autoHideTimerRef.current);
            clearInterval(countdownRef.current);
        };
    }, [showKey]);

    const handleToggleShow = async () => {
        if (showKey) {
            clearKeyFromMemory();
            return;
        }
        try {
            setIsFetchingKey(true);
            const { data } = await api.patch(
                `/users/${user.id}/order/${item.orderItemId}/reveal-key`
            );
            setRevealedKey(data);
            setShowKey(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load key.", {
                position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce,
            });
        } finally {
            setIsFetchingKey(false);
        }
    };

    const handleRevealed = (orderItemId, key) => {
        setRevealedKey(key);
        setShowKey(true);
    };

    const copyKey = () => {
        if (!revealedKey) return;
        navigator.clipboard.writeText(revealedKey).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (!item.gameKey) return null;

    return (
        <>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <Key size={12} />
                        Game Key
                    </div>
                    {isRevealed && (
                        <div className="flex items-center gap-2">
                            {showKey && autoHideCountdown !== null && (
                                <span className="text-[10px] font-semibold text-amber-500">
                                    Auto-hide in {autoHideCountdown}s
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleToggleShow}
                                disabled={isFetchingKey}
                                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 transition disabled:opacity-50"
                            >
                                {isFetchingKey
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : showKey ? <EyeOff size={13} /> : <Eye size={13} />
                                }
                                {isFetchingKey ? "Loading..." : showKey ? "Hide" : "Show"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="px-3 py-3 flex items-center gap-2">
                    {isRevealed ? (
                        <>
                            <code
                                className={`flex-1 font-mono text-sm font-bold tracking-widest transition-all ${showKey ? "text-slate-900 select-all" : "text-slate-400 blur-sm select-none"}`}
                                style={{ userSelect: showKey ? "all" : "none" }}
                            >
                                {/* Key chỉ render khi đang show, không render chuỗi key khi ẩn */}
                                {showKey ? revealedKey : "••••••••••••••••••••"}
                            </code>
                            {showKey && (
                                <button
                                    type="button"
                                    onClick={copyKey}
                                    title="Copy key"
                                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                >
                                    {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <code className="flex-1 font-mono text-sm font-bold tracking-widest text-slate-300 select-none">
                                {"•••••••••••••••••••"}
                            </code>
                            {order.orderStatus === "PAID" ? (
                                item.refundStatus ? (
                                    <span className="shrink-0 text-xs text-amber-500 font-semibold whitespace-nowrap">
                                        Refund requested
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowRevealModal(true)}
                                        className="shrink-0 inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700 whitespace-nowrap"
                                    >
                                        <Key size={12} />
                                        Reveal Key
                                    </button>
                                )
                            ) : (
                                <span className="shrink-0 text-xs text-slate-400 font-semibold whitespace-nowrap">
                                    Not available
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showRevealModal && (
                <RevealKeyModal
                    item={item}
                    order={order}
                    onClose={() => setShowRevealModal(false)}
                    onRevealed={handleRevealed}
                />
            )}
        </>
    );
};

/* ─────────────── OrderItem Card ─────────────── */
const OrderItemCard = ({ item, order }) => {
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [localRefundStatus, setLocalRefundStatus] = useState(item.refundStatus ?? null);

    const itemImage = item.product?.thumbnail;
    const canRequestRefund =
        order.orderStatus === "PAID" &&
        !item.revealed &&
        !localRefundStatus;

    const refundBadge = getRefundBadge(localRefundStatus);

    const handleRefundSuccess = () => {
        setLocalRefundStatus("PENDING");
    };

    return (
        <>
            <div className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md hover:border-slate-300">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="h-24 w-24 shrink-0 self-center sm:self-start overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                        {itemImage ? (
                            <img
                                src={itemImage}
                                alt={item.product?.productName}
                                className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <ShoppingBag size={28} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="truncate text-base font-extrabold text-slate-900 leading-tight">
                                    {item.product?.productName || "Product"}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-400 font-mono">Item #{item.orderItemId}</p>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                {item.revealed && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 ring-1 ring-blue-200">
                                        <Key size={11} /> Key Revealed
                                    </span>
                                )}
                                {refundBadge && (
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${refundBadge.className}`}>
                                        <refundBadge.Icon size={12} />
                                        {refundBadge.label}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className="font-bold text-slate-900">
                                {formatCurrency(item.orderedProductPrice, order.currency)}
                            </span>
                            {item.discount > 0 && (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                                    <Tag size={12} />
                                    {formatCurrency(item.discount, order.currency)} off
                                </span>
                            )}
                        </div>

                        {/* Request Refund button */}
                        {canRequestRefund && (
                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowRefundModal(true)}
                                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 transition hover:bg-red-100 hover:border-red-300"
                                >
                                    <RotateCcw size={12} />
                                    Request Refund
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <GameKeySection item={item} order={order} />
            </div>

            {showRefundModal && (
                <RefundModal
                    item={item}
                    order={order}
                    onClose={() => setShowRefundModal(false)}
                    onSuccess={handleRefundSuccess}
                />
            )}
        </>
    );
};

/* ─────────────── Order Card ─────────────── */
const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            {/* Order Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(order.orderStatus)}`}>
                        {statusLabel(order.orderStatus)}
                    </span>
                    {order.payment?.pgName && (
                        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                            {order.payment.pgName}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Order</p>
                        <p className="text-sm font-extrabold text-slate-900">#{order.orderId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Date</p>
                        <p className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                            <CalendarDays size={13} />
                            {formatDate(order.orderDate)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Total</p>
                        <p className="text-sm font-extrabold text-blue-700">
                            {formatCurrency(order.totalAmount, order.currency)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                        aria-label={expanded ? "Collapse" : "Expand"}
                    >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Order Items */}
            {expanded && (
                <div className="px-5 py-4 sm:px-6">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        {order.orderItems?.length || 0} item(s)
                    </p>
                    <div className="grid gap-3">
                        {(order.orderItems || []).map((item) => (
                            <OrderItemCard key={item.orderItemId} item={item} order={order} />
                        ))}
                    </div>

                    {/* Footer summary */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
                        <span>
                            Payment: <span className="font-semibold text-slate-600">{order.payment?.paymentMethod || "N/A"}</span>
                        </span>
                        <span>
                            {order.payment?.pgStatus ? `Status: ${order.payment.pgStatus}` : "Payment info unavailable"}
                        </span>
                    </div>
                </div>
            )}
        </article>
    );
};

/* ─────────────── Main Component ─────────────── */
export const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError("");
            const { data } = await api.get("/order/users");
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setOrders([]);
            setError(err?.response?.data?.message || "Failed to load your orders.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filteredOrders = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return orders;
        return orders.filter((order) => {
            const haystack = [
                order.orderId,
                order.orderStatus,
                order.user?.userId,
                order.payment?.pgName,
                order.payment?.pgStatus,
                ...(order.orderItems || []).map((item) => item?.product?.productName),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(keyword);
        });
    }, [orders, searchTerm]);

    const paidCount = orders.filter((o) => o.orderStatus === "PAID").length;
    const totalAmount = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const totalItems = orders.reduce((sum, o) => sum + (o.orderItems?.length || 0), 0);

    return (
        <>
            <Header />
            <section className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 mt-25">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    {/* ── Hero Banner ── */}
                    <div className="relative border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-6 text-white sm:px-8 sm:py-8">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />
                            <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-cyan-400 blur-3xl" />
                        </div>
                        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                                    <ShoppingBag size={14} />
                                    My orders
                                </div>
                                <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">
                                    Track every order in one place
                                </h1>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                                    Manage all your game purchases. View order details, reveal game keys, and request refunds for eligible items.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
                                <StatCard label="Orders" value={orders.length} />
                                <StatCard label="Paid" value={paidCount} />
                                <StatCard label="Total" value={formatCurrency(totalAmount)} compact />
                            </div>
                        </div>
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="space-y-4 p-4 sm:p-6">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <label className="relative w-full lg:max-w-md">
                                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search order id, status, product..."
                                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 font-medium">
                                    {totalItems} item(s) across {orders.length} order(s)
                                </span>
                                <button
                                    type="button"
                                    onClick={fetchOrders}
                                    disabled={isLoading}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* ── Content ── */}
                        {isLoading ? (
                            <StatePanel icon={Loader2} title="Loading your orders..." spinning />
                        ) : error ? (
                            <StatePanel icon={AlertCircle} title="Could not load orders" description={error} danger onRetry={fetchOrders} />
                        ) : filteredOrders.length === 0 ? (
                            <StatePanel
                                icon={PackageOpen}
                                title="No orders found"
                                description={searchTerm ? "Try a different keyword or clear the search." : "You have not placed any orders yet."}
                            />
                        ) : (
                            <div className="grid gap-4">
                                {filteredOrders.map((order) => (
                                    <OrderCard key={order.orderId} order={order} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
            `}</style>
        </>
    );
};

/* ─────────────── Sub-components ─────────────── */
const StatCard = ({ label, value, compact = false }) => (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">{label}</p>
        <p className={`mt-1 font-black text-white ${compact ? "text-sm sm:text-base" : "text-lg sm:text-2xl"}`}>{value}</p>
    </div>
);

const StatePanel = ({ icon: Icon, title, description, danger = false, spinning = false, onRetry }) => (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${danger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}>
            <Icon size={22} className={spinning ? "animate-spin" : ""} />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-slate-900">{title}</h3>
        {description && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{description}</p>}
        {onRetry && (
            <button type="button" onClick={onRetry}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700">
                <RefreshCw size={15} />
                Try again
            </button>
        )}
    </div>
);
