import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../store/actions";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard
} from "lucide-react";

// ── Icons ──────────────────────────────────────────────────────────────────────

const PersonIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const BagIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

// ── Menu item ──────────────────────────────────────────────────────────────────

const DropdownItem = ({ icon, label, onClick, to, danger }) => {
    const inner = (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-150 text-left
                ${danger
                    ? "text-red-500 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            style={{ fontFamily: "'Reddit Sans', sans-serif" }}
        >
            <span className={danger ? "text-red-400" : "text-slate-400"}>{icon}</span>
            {label}
        </button>
    );

    return to ? <Link to={to} onClick={onClick}>{inner}</Link> : inner;
};

// ── Main ───────────────────────────────────────────────────────────────────────

export const UserMenu = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const handleClose = () => setOpen(false);


    const logOutHandler = () => {
        handleClose();
        dispatch(logOutUser(navigate));
    };

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">

            {/* Avatar trigger */}
            <motion.button
                onClick={() => setOpen((p) => !p)}
                whileTap={{ scale: 0.93 }}
                className="w-9 h-9 rounded-full overflow-hidden cursor-pointer transition-colors duration-150"
                style={{
                    boxShadow: open ? "0 0 0 3px #bfdbfe" : "none",
                    transition: "box-shadow 0.15s ease",
                }}
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center">
                        {user.username[0].toUpperCase()}
                    </div>
                )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 overflow-hidden"
                        style={{
                            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                            zIndex: 9999
                        }}
                    >
                        {/* User info */}
                        <div className="px-4 py-3.5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight" style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                                        {user.username}
                                    </p>
                                    <p className="text-xs text-slate-400" style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                                        Signed in
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-2">
                            <DropdownItem icon={<PersonIcon />} label="Profile" to="/profile" onClick={handleClose} />
                            {
                                user.role === "ROLE_ADMIN" && (
                                    <DropdownItem icon={<LayoutDashboard size={15} />} label="Dashboard" to="/admin" onClick={handleClose} />
                                )
                            }
                            <DropdownItem icon={<BagIcon />} label="Orders" to="/my-orders" onClick={handleClose} />
                        </div>

                        <div className="border-t border-slate-100 p-2">
                            <DropdownItem icon={<LogoutIcon />} label="Logout" onClick={logOutHandler} danger />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};