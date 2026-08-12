import { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    FileText,
    KeyRound,
    Loader2,
    Square,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { Bounce, toast } from "react-toastify";
import api from "../../../api/api";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const showToast    = (msg) => toast.error(msg,   { position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce });
const showSuccess  = (msg) => toast.success(msg, { position: "bottom-right", autoClose: 3000, theme: "light", transition: Bounce });

const STATUS_STYLE = {
    AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    SOLD:      "bg-slate-100  text-slate-500   ring-slate-200",
    RESERVED:  "bg-amber-50   text-amber-700   ring-amber-200",
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 uppercase tracking-wide ${STATUS_STYLE[status] ?? "bg-slate-50 text-slate-400 ring-slate-200"}`}>
        {status}
    </span>
);

const TABS = ["Manual Entry", "CSV Upload"];

/* ─── Main Component ──────────────────────────────────────────────────────── */

/**
 * GameKeyModal
 * Props:
 *   product        — { productId, productName }
 *   onClose        — () => void
 *   onKeysChanged  — () => void  (optional — called after mutations so parent can refresh)
 */
export const GameKeyModal = ({ product, onClose, onKeysChanged }) => {
    /* ── state ── */
    const [activeTab,      setActiveTab]      = useState(0);

    // key list
    const [keys,           setKeys]           = useState([]);
    const [stats,          setStats]          = useState({ totalKeys: 0, availableKeys: 0, soldKeys: 0, reservedKeys: 0 });
    const [page,           setPage]           = useState(0);
    const [totalPages,     setTotalPages]     = useState(0);
    const [totalElements,  setTotalElements]  = useState(0);
    const [isLoadingKeys,  setIsLoadingKeys]  = useState(false);
    const PAGE_SIZE = 15;

    // selection (multi-delete)
    const [selected,       setSelected]       = useState(new Set());
    const [isDeleting,     setIsDeleting]     = useState(false);

    // manual entry
    const [keyInput,       setKeyInput]       = useState("");
    const [isSubmitting,   setIsSubmitting]   = useState(false);

    // csv
    const [csvFile,        setCsvFile]        = useState(null);
    const [isDragging,     setIsDragging]     = useState(false);
    const [isUploadingCsv, setIsUploadingCsv] = useState(false);
    const csvInputRef = useRef(null);

    /* ── fetch keys ── */

    const fetchKeys = useCallback(async (targetPage = page) => {
        try {
            setIsLoadingKeys(true);
            const { data } = await api.get(`/admin/products/${product.productId}/keys`, {
                params: { pageNumber: targetPage, pageSize: PAGE_SIZE },
            });
            setKeys(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
            setStats({
                totalKeys:     data.totalKeys     ?? 0,
                availableKeys: data.availableKeys ?? 0,
                soldKeys:      data.soldKeys      ?? 0,
                reservedKeys:  data.reservedKeys  ?? 0,
            });
            setSelected(new Set()); // clear selection on reload
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to load keys.");
        } finally {
            setIsLoadingKeys(false);
        }
    }, [product.productId, page]);

    useEffect(() => { fetchKeys(page); }, [page]);  // eslint-disable-line

    /* ── selection helpers ── */

    const availableOnPage = keys.filter(k => k.status === "AVAILABLE");

    const toggleOne = (id) =>
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const toggleAll = () => {
        const ids = availableOnPage.map(k => k.gameKeyId);
        const allSelected = ids.every(id => selected.has(id));
        setSelected(allSelected ? new Set() : new Set(ids));
    };

    /* ── delete selected ── */

    const handleDeleteSelected = async () => {
        if (selected.size === 0) return;
        const confirmed = window.confirm(
            `Delete ${selected.size} selected key(s)? Only AVAILABLE keys will be removed.`
        );
        if (!confirmed) return;
        try {
            setIsDeleting(true);
            const { data } = await api.delete("/admin/game-keys", {
                data: { keyIds: [...selected] },
            });
            showSuccess(data.message || `${selected.size} key(s) deleted.`);
            onKeysChanged?.();
            const targetPage = page > 0 && keys.length === selected.size ? page - 1 : page;
            setPage(targetPage);
            await fetchKeys(targetPage);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to delete keys.");
        } finally {
            setIsDeleting(false);
        }
    };

    /* ── manual entry ── */

    const handleManualSubmit = async () => {
        const codes = keyInput
            .split(/[,\n]+/)
            .map(s => s.trim())
            .filter(Boolean);

        if (codes.length === 0) return showToast("Please enter at least one key.");

        try {
            setIsSubmitting(true);
            const { data } = await api.post(`/admin/products/${product.productId}/keys`, {
                keyCodes: codes,
            });
            const added = data.content?.length ?? 0;
            showSuccess(`${added} key(s) added (${codes.length - added} duplicate(s) skipped).`);
            setKeyInput("");
            onKeysChanged?.();
            setPage(0);
            await fetchKeys(0);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to add keys.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── csv upload ── */

    const handleCsvFile = (file) => {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(".csv")) {
            showToast("Please upload a .csv file.");
            return;
        }
        setCsvFile(file);
    };

    const handleCsvUpload = async () => {
        if (!csvFile) return showToast("Please select a CSV file first.");
        const formData = new FormData();
        formData.append("file", csvFile);
        try {
            setIsUploadingCsv(true);
            const { data } = await api.post(
                `/admin/products/${product.productId}/keys/csv`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            const added = data.content?.length ?? 0;
            showSuccess(`CSV processed: ${added} key(s) added.`);
            setCsvFile(null);
            if (csvInputRef.current) csvInputRef.current.value = "";
            onKeysChanged?.();
            setPage(0);
            await fetchKeys(0);
        } catch (err) {
            showToast(err?.response?.data?.message || "CSV upload failed.");
        } finally {
            setIsUploadingCsv(false);
        }
    };

    /* ── drag-drop for CSV ── */

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleCsvFile(file);
    };

    /* ── render ── */

    const allAvailableSelected =
        availableOnPage.length > 0 &&
        availableOnPage.every(k => selected.has(k.gameKeyId));

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-slate-950/60 px-0 sm:px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full sm:max-w-3xl max-h-[96dvh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl flex flex-col">

                {/* ── Header ── */}
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 shrink-0">
                    <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-violet-600">
                            <KeyRound size={13} /> Game Keys
                        </p>
                        <h3 className="mt-1 text-base font-extrabold text-slate-950 leading-snug">
                            {product.productName}
                        </h3>
                        {/* Stats strip */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            <StatChip label="Total"     value={stats.totalKeys}     color="slate" />
                            <StatChip label="Available" value={stats.availableKeys} color="emerald" />
                            <StatChip label="Sold"      value={stats.soldKeys}      color="blue" />
                            <StatChip label="Reserved"  value={stats.reservedKeys}  color="amber" />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="overflow-y-auto flex-1 p-5 space-y-5">

                    {/* Tabs */}
                    <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                        {TABS.map((tab, i) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(i)}
                                className={`flex-1 rounded-lg py-1.5 text-sm font-bold transition ${
                                    activeTab === i
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab 0: Manual Entry ── */}
                    {activeTab === 0 && (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500">
                                Enter one or more keys separated by <strong>commas</strong> or <strong>new lines</strong>.
                            </p>
                            <textarea
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                rows={5}
                                placeholder={"XXXX-YYYY-ZZZZ, AAAA-BBBB-CCCC\nor one per line"}
                                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                            />
                            <button
                                type="button"
                                onClick={handleManualSubmit}
                                disabled={isSubmitting || !keyInput.trim()}
                                className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                                {isSubmitting ? "Adding…" : "Add Keys"}
                            </button>
                        </div>
                    )}

                    {/* ── Tab 1: CSV Upload ── */}
                    {activeTab === 1 && (
                        <div className="space-y-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-500 space-y-1">
                                <p className="font-bold text-slate-600">Accepted CSV formats:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    <li>One key per line (no header)</li>
                                    <li>Header row auto-detected and skipped</li>
                                    <li>Multiple keys per line, comma-separated</li>
                                    <li>Large files processed in batches of 500 — no memory issues</li>
                                </ul>
                            </div>

                            {/* Drop zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={onDrop}
                                onClick={() => csvInputRef.current?.click()}
                                className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                                    isDragging
                                        ? "border-violet-400 bg-violet-50"
                                        : csvFile
                                        ? "border-emerald-300 bg-emerald-50"
                                        : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50"
                                }`}
                            >
                                {csvFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText size={28} className="text-emerald-600" />
                                        <p className="font-bold text-sm text-emerald-700">{csvFile.name}</p>
                                        <p className="text-xs text-slate-400">{(csvFile.size / 1024).toFixed(1)} KB</p>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setCsvFile(null); if (csvInputRef.current) csvInputRef.current.value = ""; }}
                                            className="mt-1 text-xs text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Upload size={28} />
                                        <p className="text-sm font-semibold text-slate-500">Drop CSV here or click to browse</p>
                                        <p className="text-xs">Supports files of any size</p>
                                    </div>
                                )}
                                <input
                                    ref={csvInputRef}
                                    type="file"
                                    accept=".csv"
                                    className="sr-only"
                                    onChange={(e) => handleCsvFile(e.target.files?.[0])}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleCsvUpload}
                                disabled={isUploadingCsv || !csvFile}
                                className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isUploadingCsv && <Loader2 size={14} className="animate-spin" />}
                                {isUploadingCsv ? "Processing…" : "Upload CSV"}
                            </button>
                        </div>
                    )}

                    {/* ── Key list ── */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                                Key inventory · {totalElements} total
                            </p>
                            {selected.size > 0 && (
                                <button
                                    type="button"
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                                >
                                    {isDeleting
                                        ? <Loader2 size={12} className="animate-spin" />
                                        : <Trash2 size={12} />}
                                    Delete {selected.size} selected
                                </button>
                            )}
                        </div>

                        {isLoadingKeys ? (
                            <div className="flex items-center justify-center py-10 text-slate-400">
                                <Loader2 size={22} className="animate-spin mr-2" /> Loading keys…
                            </div>
                        ) : keys.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <AlertCircle size={28} className="mb-2" />
                                <p className="text-sm font-semibold">No keys yet</p>
                                <p className="text-xs">Add keys using the tabs above.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                {/* Table header */}
                                <div className="grid grid-cols-[32px_1fr_90px_32px] gap-x-3 bg-slate-50 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                    {/* Select-all toggle */}
                                    <button
                                        type="button"
                                        onClick={toggleAll}
                                        className="flex items-center justify-center text-slate-400 hover:text-violet-600 transition"
                                        title="Select all AVAILABLE on this page"
                                    >
                                        {allAvailableSelected
                                            ? <CheckSquare size={14} className="text-violet-600" />
                                            : <Square size={14} />
                                        }
                                    </button>
                                    <span>Key Code</span>
                                    <span>Status</span>
                                    <span />
                                </div>

                                {/* Rows */}
                                <div className="divide-y divide-slate-50">
                                    {keys.map((key) => {
                                        const isAvail = key.status === "AVAILABLE";
                                        const isChecked = selected.has(key.gameKeyId);
                                        return (
                                            <div
                                                key={key.gameKeyId}
                                                className={`grid grid-cols-[32px_1fr_90px_32px] gap-x-3 items-center px-3 py-2.5 text-sm transition ${
                                                    isChecked ? "bg-violet-50" : "hover:bg-slate-50"
                                                }`}
                                            >
                                                {/* Checkbox */}
                                                <button
                                                    type="button"
                                                    disabled={!isAvail}
                                                    onClick={() => isAvail && toggleOne(key.gameKeyId)}
                                                    className={`flex items-center justify-center transition ${
                                                        isAvail ? "text-slate-400 hover:text-violet-600 cursor-pointer" : "text-slate-200 cursor-default"
                                                    }`}
                                                >
                                                    {isChecked
                                                        ? <CheckSquare size={14} className="text-violet-600" />
                                                        : <Square size={14} />
                                                    }
                                                </button>

                                                {/* Key code */}
                                                <span className="font-mono text-xs font-semibold text-slate-700 truncate">
                                                    {key.keyCode}
                                                </span>

                                                {/* Status */}
                                                <StatusBadge status={key.status} />

                                                {/* Quick delete */}
                                                {isAvail ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelected(new Set([key.gameKeyId])); setTimeout(handleDeleteSelected, 0); }}
                                                        className="flex items-center justify-center text-slate-300 hover:text-red-500 transition"
                                                        title="Delete this key"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                ) : <span />}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
                                        <p className="text-xs text-slate-400">
                                            Page {page + 1} of {totalPages}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                disabled={page === 0 || isLoadingKeys}
                                                onClick={() => setPage(p => p - 1)}
                                                className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft size={13} /> Prev
                                            </button>
                                            <button
                                                type="button"
                                                disabled={page >= totalPages - 1 || isLoadingKeys}
                                                onClick={() => setPage(p => p + 1)}
                                                className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                Next <ChevronRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 shrink-0">
                    <p className="text-xs text-slate-400">
                        {stats.availableKeys} available · {stats.soldKeys} sold
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── StatChip ────────────────────────────────────────────────────────────── */

const COLOR_MAP = {
    slate:   "bg-slate-100   text-slate-600",
    emerald: "bg-emerald-50  text-emerald-700",
    blue:    "bg-blue-50     text-blue-700",
    amber:   "bg-amber-50    text-amber-700",
};

const StatChip = ({ label, value, color = "slate" }) => (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${COLOR_MAP[color]}`}>
        <span className="opacity-70">{label}</span>
        <span>{value}</span>
    </span>
);
