import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["var(--color-blue-600)", "var(--color-mustard)", "var(--color-cobalt)", "var(--color-moss)", "var(--color-lilac)"];

// Colour panels wipe off the screen on every route change (skipped on first load).
export const PageCurtain = () => {
    const { pathname } = useLocation();
    const reduce = useReducedMotion();
    const prev = useRef(pathname);
    const count = useRef(0);

    // Only real path changes count; query-string updates (filters, paging) don't replay the wipe.
    if (prev.current !== pathname) {
        prev.current = pathname;
        count.current += 1;
    }
    if (reduce || count.current === 0) return null;

    const c1 = COLORS[count.current % COLORS.length];
    const c2 = COLORS[(count.current + 2) % COLORS.length];

    return (
        <div key={count.current} className="pointer-events-none fixed inset-0 z-[300]" aria-hidden="true">
            <motion.div
                className="absolute inset-0 origin-top border-b border-slate-900"
                style={{ background: c2 }}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
                className="absolute inset-0 origin-top border-b border-slate-900 grid place-items-center"
                style={{ background: c1 }}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            >
                <motion.span
                    className="display text-6xl md:text-8xl text-slate-900"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    S/
                </motion.span>
            </motion.div>
        </div>
    );
};
