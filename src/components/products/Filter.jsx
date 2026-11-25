import { useEffect, useRef, useState } from "react";
import { FiRefreshCcw, FiSearch, FiChevronDown } from "react-icons/fi";
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
                aria-haspopup="listbox" aria-expanded={open} className="w-full h-11 flex items-center justify-between gap-3 px-3.5 bg-white border border-slate-900 rounded-md text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors duration-150"
            >
                <span className={selected ? "text-slate-900" : "text-slate-500"}>
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
                        role="listbox" className="absolute top-full left-0 mt-1.5 w-full bg-white border border-slate-900 rounded-md overflow-hidden z-50"
                        style={{ boxShadow: "var(--shadow-block)" }}
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100
                                        ${opt.value === value
                                            ? "bg-slate-900 text-slate-50 font-semibold"
                                            : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Genre Tag Chips ────────────────────────────────────────────────────────────

const GenreChips = ({ genres, selected, onChange }) => {
    if (!genres || genres.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-dashed border-slate-300">
            <span className="label-mono text-slate-500 self-center pr-2">Genre</span>

            {/* All chip */}
            <button
                type="button"
                onClick={() => onChange("all")}
                aria-pressed={selected === "all"}
                className={`px-3 py-1.5 rounded-sm border text-xs font-semibold transition-colors duration-150 ${selected === "all"
                    ? "bg-slate-900 border-slate-900 text-slate-50"
                    : "border-slate-300 text-slate-700 hover:border-slate-900"
                    }`}
            >
                All
            </button>

            {genres.map((g) => {
                const isSelected = selected === g.genreName;
                return (
                    <motion.button
                        key={g.genreId}
                        type="button"
                        onClick={() => onChange(g.genreName)}
                        aria-pressed={isSelected}
                        whileTap={{ scale: 0.94 }}
                        className={`px-3 py-1.5 rounded-sm border text-xs font-semibold transition-colors duration-150 ${isSelected
                            ? "bg-slate-900 border-slate-900 text-slate-50"
                            : "border-slate-300 text-slate-700 hover:border-slate-900"
                            }`}
                    >
                        {g.genreName}
                    </motion.button>
                );
            })}
        </div>
    );
};

// ── Filter ─────────────────────────────────────────────────────────────────────

export const Filter = ({ categories, genres }) => {
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const [category, setCategory] = useState("all");
    const [genre, setGenre] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");

    // Sync state with URL params
    useEffect(() => {
        setCategory(searchParams.get("category") || "all");
        setGenre(searchParams.get("genre") || "all");
        setSortOrder(searchParams.get("sortOrder") || "asc");
        setSearchTerm(searchParams.get("keyword") || "");
    }, [searchParams]);

    // Debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            const p = new URLSearchParams(searchParams);
            if (searchTerm) { p.set("keyword", searchTerm); }
            else { p.delete("keyword"); }
            p.delete("pageNumber");
            navigate(`${pathname}?${p.toString()}`);
        }, 600);
        return () => clearTimeout(handler);
    }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryChange = (val) => {
        const p = new URLSearchParams(searchParams);
        if (val === "all") { p.delete("category"); }
        else { p.set("category", val); }
        p.delete("pageNumber");
        navigate(`${pathname}?${p.toString()}`);
        setCategory(val);
        scrollToTop();
    };

    const handleGenreChange = (val) => {
        const p = new URLSearchParams(searchParams);
        if (val === "all") { p.delete("genre"); }
        else { p.set("genre", val); }
        p.delete("pageNumber");
        navigate(`${pathname}?${p.toString()}`);
        setGenre(val);
        scrollToTop();
    };

    const toggleSortOrder = (val) => {
        const p = new URLSearchParams(searchParams);
        p.set("sortOrder", val);
        p.delete("pageNumber");
        navigate(`${pathname}?${p.toString()}`);
        setSortOrder(val);
    };

    const handleClearFilter = () => {
        navigate({ pathname });
        scrollToTop();
    };

    const categoryOptions = [
        { value: "all", label: "All Categories" },
        ...(categories?.map((c) => ({ value: c.categoryName, label: c.categoryName })) || []),
    ];

    const genreOptions = [
        { value: "all", label: "All Genres" },
        ...(genres?.map((g) => ({ value: g.genreName, label: g.genreName })) || []),
    ];

const sortOptions = [
    { value: "asc", label: "Price: low to high" },
    { value: "desc", label: "Price: high to low" },
];

const hasActiveFilter = category !== "all" || genre !== "all" || sortOrder !== "asc" || searchTerm !== "";

return (
    <>

        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-slate-900 rounded-lg p-4 md:p-5"
        >
            {/* Row 1: Search + Category + Sort + Clear */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* Search */}
                <div className="relative w-full lg:max-w-sm">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search games" className="w-full h-11 border border-slate-900 rounded-md pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
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
                        value={genre}
                        onChange={handleGenreChange}
                        options={genreOptions}
                        placeholder="Genre"
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
                                className="flex items-center gap-2 h-11 px-3.5 text-blue-700 hover:text-blue-900 underline underline-offset-4 text-sm font-semibold"
                            >
                                <FiRefreshCcw className="text-xs" />
                                Clear
                            </motion.button>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Row 2: Genre chips */}
            <GenreChips
                genres={genres}
                selected={genre}
                onChange={handleGenreChange}
            />
        </motion.div>
    </>
);
};