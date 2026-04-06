import { useEffect, useRef, useState } from "react";
import { FiRefreshCcw, FiSearch, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Custom Select ──────────────────────────────────────────────────────────────

const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative" style={{ minWidth: 160 }}>
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 transition-all duration-150"
                style={{ fontFamily: "'Reddit Sans', sans-serif" }}
            >
                <span className={selected ? "text-slate-800" : "text-slate-400"}>
                    {selected?.label || placeholder}
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
                    <FiChevronDown className="text-slate-400 text-xs" />
                </motion.span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden z-50"
                        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100
                                    ${opt.value === value
                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                        : "text-slate-700 hover:bg-slate-50"
                                    }`}
                                style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Filter ─────────────────────────────────────────────────────────────────────

export const Filter = ({ categories }) => {
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const [category, setCategory] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setCategory(searchParams.get("category") || "all");
        setSortOrder(searchParams.get("sortOrder") || "asc");
        setSearchTerm(searchParams.get("keyword") || "");
    }, [searchParams]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) { searchParams.set("keyword", searchTerm); }
            else { searchParams.delete("keyword"); }
            navigate(`${pathname}?${searchParams.toString()}`);
        }, 600);
        return () => clearTimeout(handler);
    }, [searchParams, searchTerm, navigate, pathname]);

    const handleCategoryChange = (val) => {
        if (val === "all") { params.delete("category"); }
        else { params.set("category", val); }
        navigate(`${pathname}?${params}`);
        setCategory(val);
    };

    const toggleSortOrder = (val) => {
        params.set("sortOrder", val);
        navigate(`${pathname}?${params}`);
        setSortOrder(val);
    };

    const handleClearFilter = () => navigate({ pathname });

    const categoryOptions = [
        { value: "all", label: "All Categories" },
        ...(categories?.map((c) => ({ value: c.categoryName, label: c.categoryName })) || []),
    ];

    const sortOptions = [
        { value: "asc", label: "Price: Low → High" },
        { value: "desc", label: "Price: High → Low" },
    ];

    const hasActiveFilter = category !== "all" || sortOrder !== "asc" || searchTerm !== "";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700&display=swap');
                .filter-wrap * { font-family: 'Reddit Sans', sans-serif; }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="filter-wrap bg-white border border-slate-200 rounded-2xl p-5 mb-10"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Search */}
                    <div className="relative w-full lg:max-w-sm">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                        />
                    </div>

                    {/* Right controls */}
                    <div className="flex flex-wrap items-center gap-3">

                        <CustomSelect
                            value={category}
                            onChange={handleCategoryChange}
                            options={categoryOptions}
                            placeholder="Category"
                        />

                        <CustomSelect
                            value={sortOrder}
                            onChange={toggleSortOrder}
                            options={sortOptions}
                            placeholder="Sort Price"
                        />

                        {/* Clear */}
                        <AnimatePresence>
                            {hasActiveFilter && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                    onClick={handleClearFilter}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-all duration-150"
                                    style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                                >
                                    <FiRefreshCcw className="text-xs" />
                                    Clear
                                </motion.button>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </motion.div>
        </>
    );
};