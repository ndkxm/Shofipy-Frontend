import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { accentAt } from "./Motion";

const COLUMNS = [
    {
        title: "Shop",
        links: [
            { label: "Home", to: "/" },
            { label: "All games", to: "/products" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
        ],
    },
    {
        title: "Help",
        links: [
            { label: "FAQ", to: "/faq" },
            { label: "Returns & refunds", to: "/returns" },
            { label: "Privacy policy", to: "/policy" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Log in", to: "/signin" },
            { label: "Create account", to: "/register" },
            { label: "My orders", to: "/my-orders" },
        ],
    },
];

export const Footer = () => (
    <footer className="mt-24 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="max-w-xs">
                <Logo tone="light" />
                <p className="mt-5 text-sm leading-relaxed text-slate-400">
                    Steam keys at fair prices, delivered to your inbox the moment payment clears.
                </p>
            </div>

            {COLUMNS.map((col) => (
                <div key={col.title}>
                    <p className="label-mono text-slate-500 mb-4">{col.title}</p>
                    <ul className="space-y-2.5">
                        {col.links.map((l) => (
                            <li key={l.to}>
                                <Link to={l.to} className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        {/* Oversized wordmark as a closing rule */}
        <div className="max-w-7xl mx-auto px-6 overflow-hidden" aria-hidden="true">
            <p className="display text-[18vw] md:text-[11rem] text-slate-800 select-none leading-[0.8] -mb-3 flex">
                {"Shofipy".split("").map((ch, i) => (
                    <motion.span
                        key={i}
                        className="inline-block cursor-default"
                        whileHover={{ y: -24, color: accentAt(i).solid, rotate: i % 2 ? 8 : -8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {ch}
                    </motion.span>
                ))}
            </p>
        </div>

        <div className="border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 label-mono text-slate-500">
                <span>© {new Date().getFullYear()} Shofipy</span>
                <span>All prices in USD</span>
            </div>
        </div>
    </footer>
);
