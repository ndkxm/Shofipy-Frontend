import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaShoppingBag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FacebookIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
 
const InstagramIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);
 
const TwitterIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
);
 
const BagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);
 
const SHOP_LINKS = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "About us", to: "/about" },
    { label: "Contact", to: "/contact" },
];
 
const CUSTOMER_LINKS = [
    { label: "FAQ", to: "/faq" },
    { label: "Returns", to: "/returns" },
    { label: "Privacy Policy", to: "/policy" },
];
 
const SOCIALS = [
    { icon: <FacebookIcon />, hoverColor: "#3b82f6", label: "Facebook" },
    { icon: <InstagramIcon />, hoverColor: "#ec4899", label: "Instagram" },
    { icon: <TwitterIcon />, hoverColor: "#38bdf8", label: "Twitter" },
];
 
export const Footer = () => (
    <footer
        className="mt-20"
        style={{ background: "#0f172a", fontFamily: "'Reddit Sans', sans-serif" }}
    >
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
 
            {/* Brand */}
            <div>
                <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                        <BagIcon />
                    </div>
                    <span className="text-lg font-extrabold text-white tracking-tight">Shofipy</span>
                </Link>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Your Ultimate Gaming Destination. Discover amazing games, build your library, and join the community.
                </p>
            </div>
 
            {/* Shop */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Shop</p>
                <ul className="space-y-3">
                    {SHOP_LINKS.map((l) => (
                        <li key={l.to}>
                            <Link
                                to={l.to}
                                className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
 
            {/* Customer */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Customer</p>
                <ul className="space-y-3">
                    {CUSTOMER_LINKS.map((l) => (
                        <li key={l.label}>
                            <Link
                                to={l.to}
                                className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
 
            {/* Social */}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Follow Us</p>
                <div className="flex gap-2 mb-5">
                    {SOCIALS.map((s) => (
                        <motion.button
                            key={s.label}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all duration-150"
                            title={s.label}
                        >
                            {s.icon}
                        </motion.button>
                    ))}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Stay connected for updates<br />and exclusive deals.
                </p>
            </div>
        </div>
 
        {/* Bottom bar */}
        <div className="border-t border-slate-800 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} Shofipy. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
                {["Terms", "Privacy", "Cookies"].map((t) => (
                    <a key={t} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-150">
                        {t}
                    </a>
                ))}
            </div>
        </div>
    </footer>
);