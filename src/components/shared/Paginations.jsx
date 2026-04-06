import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const ChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const getPageNumbers = (currentPage, totalPages, siblingCount = 1, boundaryCount = 2) => {
    const range = (start, end) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const startBoundary = range(1, Math.min(boundaryCount, totalPages));
    const endBoundary = range(Math.max(totalPages - boundaryCount + 1, 1), totalPages);

    const siblingStart = Math.max(currentPage - siblingCount, 1);
    const siblingEnd = Math.min(currentPage + siblingCount, totalPages);
    const sibling = range(siblingStart, siblingEnd);

    const merged = [...new Set([...startBoundary, ...sibling, ...endBoundary])].sort((a, b) => a - b);

    const result = [];
    let prev = null;
    for (const page of merged) {
        if (prev !== null && page - prev > 1) result.push("...");
        result.push(page);
        prev = page;
    }
    return result;
};

export const Paginations = ({ numberOfPage, totalProducts }) => {
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const currentPage = searchParams.get("pageNumber") ? Number(searchParams.get("pageNumber")) : 1;
    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const onPageChangeHandler = (value) => {
        if (value < 1 || value > numberOfPage || value === currentPage) return;
        params.set("pageNumber", value.toString());
        navigate(`${pathname}?${params}`);
    };

    if (!numberOfPage || numberOfPage <= 1) return null;

    const pages = getPageNumbers(currentPage, numberOfPage, 1, 2);

    return (
        <div className="flex flex-col items-center gap-4">
            {totalProducts > 0 && (
                <p style={{ fontFamily: "'Reddit Sans', sans-serif" }} className="text-xs text-slate-400 font-medium">
                    {totalProducts} products found
                </p>
            )}

            <div className="flex items-center gap-1.5">
                {/* Prev */}
                <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onPageChangeHandler(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-150
                        ${currentPage === 1
                            ? "border-slate-100 text-slate-300 cursor-not-allowed bg-white"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 bg-white cursor-pointer"
                        }`}
                >
                    <ChevronLeft />
                </motion.button>

                {/* Page numbers */}
                {pages.map((page, i) =>
                    page === "..." ? (
                        <span
                            key={`dots-${i}`}
                            className="w-9 h-9 flex items-center justify-center text-sm text-slate-400"
                            style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                        >
                            ···
                        </span>
                    ) : (
                        <motion.button
                            key={page}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => onPageChangeHandler(page)}
                            className={`w-9 h-9 rounded-xl border text-sm font-semibold transition-all duration-150
                                ${page === currentPage
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                                }`}
                            style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                        >
                            {page}
                        </motion.button>
                    )
                )}

                {/* Next */}
                <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onPageChangeHandler(currentPage + 1)}
                    disabled={currentPage === numberOfPage}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-150
                        ${currentPage === numberOfPage
                            ? "border-slate-100 text-slate-300 cursor-not-allowed bg-white"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 bg-white cursor-pointer"
                        }`}
                >
                    <ChevronRight />
                </motion.button>
            </div>
        </div>
    );
};