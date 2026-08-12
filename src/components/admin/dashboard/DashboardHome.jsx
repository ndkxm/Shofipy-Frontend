import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    Boxes,
    ClipboardList,
    Loader2,
    PackageX,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
    Trophy,
    Users,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import api from "../../../api/api";

// ─── formatting helpers ─────────────────────────────────────────────────────
const fmt = (v) => new Intl.NumberFormat("en-US").format(Number(v || 0));
const fmtUSD = (v) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(Number(v || 0));

const todayLabel = () =>
    new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(new Date());

// ─── default date range helpers ─────────────────────────────────────────────
const toISODate = (d) => d.toISOString().slice(0, 10);
const defaultFrom = () => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return toISODate(d);
};
const defaultTo = () => toISODate(new Date());

// ─── custom chart tooltip ───────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg text-sm">
            <p className="font-semibold text-slate-500 mb-1">{label}</p>
            <p className="font-bold text-blue-600">{fmtUSD(payload[0]?.value)}</p>
        </div>
    );
};

// ─── KPI stat card ──────────────────────────────────────────────────────────
const StatCard = ({ label, value, helper, icon: Icon, accent, helperPositive }) => (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-950">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon size={20} />
            </div>
        </div>
        <p className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${helperPositive === false ? "text-red-500" : "text-slate-500"}`}>
            {helperPositive === false
                ? <ArrowDownRight size={13} className="text-red-500" />
                : <ArrowUpRight size={13} className="text-emerald-500" />
            }
            {helper}
        </p>
    </article>
);

// ─── mini info block ────────────────────────────────────────────────────────
const InfoBlock = ({ label, value }) => (
    <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-2 text-lg font-extrabold text-slate-950">{value}</p>
    </div>
);

// ─── main exported component ────────────────────────────────────────────────
export const DashboardHome = () => {
    const [analytics, setAnalytics]       = useState(null);
    const [isLoading, setIsLoading]       = useState(true);
    const [error, setError]               = useState("");

    // chart state
    const [chartData, setChartData]       = useState([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [chartError, setChartError]     = useState("");
    const [groupBy, setGroupBy]           = useState("DAY");
    const [from, setFrom]                 = useState(defaultFrom);
    const [to, setTo]                     = useState(defaultTo);
    const [totalChartRevenue, setTotalChartRevenue] = useState(0);

    // top products state
    const [topProducts, setTopProducts]       = useState([]);
    const [topLoading, setTopLoading]         = useState(true);
    const [topError, setTopError]             = useState("");
    const [topLimit, setTopLimit]             = useState(10);

    // ── fetch overview ──────────────────────────────────────────────────────
    const fetchAnalytics = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const { data } = await api.get("/admin/analytics/dashboard");
            setAnalytics(data);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load analytics.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── fetch chart ─────────────────────────────────────────────────────────
    const fetchChart = useCallback(async () => {
        setChartLoading(true);
        setChartError("");
        try {
            const { data } = await api.get("/admin/analytics/revenue/chart", {
                params: { from, to, groupBy },
            });
            const mapped = (data.label ?? []).map((lbl, i) => ({
                label: lbl,
                revenue: Number(data.revenue?.[i] ?? 0),
            }));
            setChartData(mapped);
            setTotalChartRevenue(Number(data.totalRevenue ?? 0));
        } catch (err) {
            setChartError(err?.response?.data?.message || "Failed to load chart data.");
        } finally {
            setChartLoading(false);
        }
    }, [from, to, groupBy]);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);
    useEffect(() => { fetchChart(); }, [fetchChart]);

    // ── fetch top products ──────────────────────────────────────────────────
    const fetchTopProducts = useCallback(async () => {
        setTopLoading(true);
        setTopError("");
        try {
            const { data } = await api.get("/admin/analytics/top-product", {
                params: { limit: topLimit },
            });
            setTopProducts(data ?? []);
        } catch (err) {
            // 404 / "No product found" → just show empty
            if (err?.response?.status === 400 || err?.response?.data?.message?.includes("No product")) {
                setTopProducts([]);
            } else {
                setTopError(err?.response?.data?.message || "Failed to load top products.");
            }
        } finally {
            setTopLoading(false);
        }
    }, [topLimit]);

    useEffect(() => { fetchTopProducts(); }, [fetchTopProducts]);

    // ── derived kpi stats ───────────────────────────────────────────────────
    const avgOrderValue = useMemo(() => {
        const orders = Number(analytics?.totalOrder || 0);
        const rev    = Number(analytics?.totalRevenue || 0);
        return orders > 0 ? rev / orders : 0;
    }, [analytics]);

    const stats = useMemo(() => [
        {
            label: "Total Revenue",
            value: fmtUSD(analytics?.totalRevenue),
            helper: "All completed orders",
            icon: Banknote,
            accent: "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Total Orders",
            value: fmt(analytics?.totalOrder),
            helper: "Orders in system",
            icon: ClipboardList,
            accent: "bg-blue-50 text-blue-700",
        },
        {
            label: "Total Products",
            value: fmt(analytics?.totalProduct),
            helper: "Active catalog",
            icon: Boxes,
            accent: "bg-amber-50 text-amber-700",
        },
        {
            label: "New Users Today",
            value: fmt(analytics?.newUsersToday),
            helper: "Registered today",
            icon: Users,
            accent: "bg-indigo-50 text-indigo-700",
        },
        {
            label: "Revenue Today",
            value: fmtUSD(analytics?.revenueToday),
            helper: "Completed orders today",
            icon: TrendingUp,
            accent: "bg-teal-50 text-teal-700",
        },
        {
            label: "Low Stock",
            value: fmt(analytics?.lowStockProducts),
            helper: "Products ≤ 10 units",
            icon: PackageX,
            accent: "bg-rose-50 text-rose-700",
            helperPositive: Number(analytics?.lowStockProducts) === 0,
        },
    ], [analytics]);

    // ── loading skeleton ────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <section className="flex flex-1 items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 className="animate-spin text-blue-600" size={34} />
                    <p className="text-sm font-semibold">Loading analytics…</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex flex-1 items-center justify-center py-24">
                <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <AlertCircle size={28} className="mx-auto text-red-400" />
                    <h2 className="mt-4 text-base font-extrabold text-slate-950">Could not load analytics</h2>
                    <p className="mt-2 text-sm text-slate-500">{error}</p>
                    <button
                        onClick={fetchAnalytics}
                        className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 transition"
                    >
                        <RefreshCw size={15} /> Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6 py-6">

            {/* ── KPI CARDS ── */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {/* ── REVENUE CHART ── */}
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                {/* chart header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-950">Revenue over time</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Total in range:&nbsp;
                            <span className="font-bold text-blue-600">{fmtUSD(totalChartRevenue)}</span>
                        </p>
                    </div>

                    {/* filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="date"
                            value={from}
                            max={to}
                            onChange={(e) => setFrom(e.target.value)}
                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xs text-slate-400 font-medium">to</span>
                        <input
                            type="date"
                            value={to}
                            min={from}
                            onChange={(e) => setTo(e.target.value)}
                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {["DAY", "WEEK", "MONTH"].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGroupBy(g)}
                                className={`h-9 rounded-lg px-3 text-xs font-bold transition ${
                                    groupBy === g
                                        ? "bg-blue-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* chart body */}
                <div className="mt-6 h-64">
                    {chartLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="animate-spin text-blue-500" size={26} />
                        </div>
                    ) : chartError ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                            <AlertCircle size={22} className="text-red-400" />
                            <p className="text-sm text-slate-500">{chartError}</p>
                            <button
                                onClick={fetchChart}
                                className="text-xs font-semibold text-blue-600 hover:underline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-sm text-slate-400">No revenue data for this period.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
                                    width={55}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={2.5}
                                    fill="url(#revGrad)"
                                    dot={false}
                                    activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </article>

            {/* ── SECONDARY INFO ── */}
            <div className="grid gap-5 lg:grid-cols-2">
                {/* store snapshot */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="font-extrabold text-slate-950">Store snapshot</h2>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                            <ShieldCheck size={13} /> Live
                        </span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <InfoBlock label="Avg. order value"   value={fmtUSD(avgOrderValue)} />
                        <InfoBlock label="Pending orders"     value={fmt(analytics?.pendingOrders)} />
                        <InfoBlock label="New orders today"   value={fmt(analytics?.newOrdersToday)} />
                    </div>
                </article>

                {/* alerts */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="font-extrabold text-slate-950">Alerts</h2>
                    <div className="mt-4 space-y-3">
                        <AlertRow
                            color="amber"
                            label="Low-stock products"
                            value={fmt(analytics?.lowStockProducts)}
                            suffix="product(s) need restocking"
                        />
                        <AlertRow
                            color="blue"
                            label="Pending orders"
                            value={fmt(analytics?.pendingOrders)}
                            suffix="order(s) awaiting payment"
                        />
                        <AlertRow
                            color="teal"
                            label="New users today"
                            value={fmt(analytics?.newUsersToday)}
                            suffix="user(s) joined today"
                        />
                    </div>
                </article>
            </div>

            {/* ── TOP PRODUCTS ── */}
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Trophy size={17} className="text-amber-500" />
                        <h2 className="font-extrabold text-slate-950">Top selling products</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {[5, 10, 20].map((n) => (
                            <button
                                key={n}
                                onClick={() => setTopLimit(n)}
                                className={`h-7 rounded-lg px-2.5 text-xs font-bold transition ${
                                    topLimit === n
                                        ? "bg-blue-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                Top {n}
                            </button>
                        ))}
                    </div>
                </div>

                {topLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                    </div>
                ) : topError ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <AlertCircle size={20} className="text-red-400" />
                        <p className="text-sm text-slate-500">{topError}</p>
                        <button onClick={fetchTopProducts} className="text-xs font-semibold text-blue-600 hover:underline">Retry</button>
                    </div>
                ) : topProducts.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">No sales data yet.</p>
                ) : (
                    <div className="mt-5 space-y-3">
                        {/* compute max sold for bar scaling */}
                        {(() => {
                            const maxSold = Math.max(...topProducts.map(p => Number(p.sold) || 0), 1);
                            return topProducts.map((product, idx) => (
                                <div key={product.productId} className="flex items-center gap-3">
                                    {/* rank */}
                                    <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                                        idx === 0 ? "bg-amber-100 text-amber-700" :
                                        idx === 1 ? "bg-slate-100 text-slate-600" :
                                        idx === 2 ? "bg-orange-100 text-orange-700" :
                                        "bg-slate-50 text-slate-500"
                                    }`}>{idx + 1}</span>

                                    {/* name + bar */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-semibold text-slate-800">{product.productName}</p>
                                            <span className="flex-shrink-0 text-xs font-bold text-slate-500">
                                                {fmt(product.sold)} sold
                                            </span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-blue-500 transition-all"
                                                style={{ width: `${(Number(product.sold) / maxSold) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </article>
        </section>
    );
};

// ─── AlertRow helper ────────────────────────────────────────────────────────
const COLOR = {
    amber: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
    blue:  { dot: "bg-blue-400",  text: "text-blue-700",  bg: "bg-blue-50"  },
    teal:  { dot: "bg-teal-400",  text: "text-teal-700",  bg: "bg-teal-50"  },
};

const AlertRow = ({ color, label, value, suffix }) => {
    const c = COLOR[color] ?? COLOR.blue;
    return (
        <div className={`flex items-center justify-between rounded-lg ${c.bg} px-4 py-3`}>
            <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                <span className={`text-sm font-semibold ${c.text}`}>{label}</span>
            </div>
            <span className={`text-sm font-bold ${c.text}`}>
                {value}&nbsp;<span className="font-normal opacity-75">{suffix}</span>
            </span>
        </div>
    );
};
