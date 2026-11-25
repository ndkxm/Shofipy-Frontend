import { Link } from "react-router-dom";

// Key-cap mark + expanded wordmark. `tone="light"` for dark backgrounds.
export const Logo = ({ tone = "dark", to = "/" }) => (
    <Link to={to} className="inline-flex items-center gap-2.5 group" aria-label="Shofipy home">
        <span
            className={`grid place-items-center w-8 h-8 rounded-md border font-mono text-sm font-semibold transition-transform duration-150 group-hover:-translate-x-px group-hover:-translate-y-px
                ${tone === "light" ? "bg-blue-600 border-slate-50 text-white" : "bg-blue-600 border-slate-900 text-white"}`}
            style={{ boxShadow: tone === "light" ? "2px 2px 0 0 #f7f5f0" : "var(--shadow-block-sm)" }}
            aria-hidden="true"
        >
            S/
        </span>
        <span
            className={`text-lg font-extrabold tracking-tight ${tone === "light" ? "text-slate-50" : "text-slate-900"}`}
            style={{ fontStretch: "125%" }}
        >
            Shofipy
        </span>
    </Link>
);
