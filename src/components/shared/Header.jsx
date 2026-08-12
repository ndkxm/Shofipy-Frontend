import { useState } from "react";
import { FaShoppingBag, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux"; // Thêm useDispatch
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { logOutUser } from "../../store/actions"; // Đảm bảo đường dẫn này đúng với dự án của bạn
import { UserMenu } from "./UserMenu";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Games", to: "/products" },
    { label: "Contact", to: "/contact" },
    { label: "About us", to: "/about" },
];

const BagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export const Header = () => {
    const [navBarOpen, setNavBarOpen] = useState(false);

    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);

    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartCount = cart?.length || 0;

    const handleMobileLogout = () => {
        setNavBarOpen(false);
        dispatch(logOutUser(navigate));
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
                .header-wrap * { font-family: 'Reddit Sans', sans-serif; }
                .nav-link { position: relative; }
                .nav-link::after {
                    content: ''; position: absolute; bottom: -3px; left: 0;
                    width: 0; height: 2px; background: #3b82f6;
                    border-radius: 2px; transition: width 0.2s ease;
                }
                .nav-link:hover::after, .nav-link.active::after { width: 100%; }
            `}</style>

            <div className="header-wrap fixed top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">

                {/* Top bar */}
                <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
                            <BagIcon className="text-white text-base" />
                        </div>
                        <span className="font-extrabold text-xl text-slate-900 tracking-tight">Shofipy</span>
                    </Link>

                    {/* Desktop nav */}
                    <ul className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`nav-link text-sm font-semibold transition-colors duration-150 ${pathname === link.to ? "text-blue-600 active" : "text-slate-600 hover:text-slate-900"}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right actions (Desktop) */}
                    <div className="hidden lg:flex items-center gap-3">

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors duration-150 text-slate-600 hover:text-slate-900">
                            <FaShoppingCart size={18} />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    style={{ width: 18, height: 18, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* Auth */}
                        {user?.username ? (
                            <UserMenu user={user} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/signin"
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all duration-150"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-150"
                                    style={{ boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: cart + hamburger */}
                    <div className="lg:hidden flex items-center gap-2">
                        <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600">
                            <FaShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    style={{ width: 17, height: 17, fontSize: 10 }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setNavBarOpen(!navBarOpen)}
                            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors duration-150"
                        >
                            {navBarOpen ? <FaTimes size={17} /> : <FaBars size={17} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {navBarOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
                        >
                            <div className="px-5 py-4 space-y-1">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setNavBarOpen(false)}
                                        className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150
                                            ${pathname === link.to ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                <div className="pt-3 border-t border-slate-100">
                                    {user?.username ? (
                                        <div className="flex flex-col gap-1 pb-2">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 py-2 px-4 mb-2">
                                                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                                                            {user.username[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 leading-tight">
                                                        {user.username}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">Signed in</p>
                                                </div>
                                            </div>

                                            {/* Links */}
                                            <Link to="/profile" onClick={() => setNavBarOpen(false)}
                                                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                                Profile
                                            </Link>

                                            {user.role === "ROLE_ADMIN" && (
                                                <Link to="/admin" onClick={() => setNavBarOpen(false)}
                                                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                                    Dashboard
                                                </Link>
                                            )}

                                            <Link to="/my-orders" onClick={() => setNavBarOpen(false)}
                                                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                                Orders
                                            </Link>

                                            {/* Logout Button */}
                                            <button
                                                onClick={handleMobileLogout}
                                                className="block w-full text-left px-4 py-2.5 mt-1 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 pt-1">
                                            <Link to="/signin" onClick={() => setNavBarOpen(false)}
                                                className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors duration-150">
                                                Login
                                            </Link>
                                            <Link to="/register" onClick={() => setNavBarOpen(false)}
                                                className="block text-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150">
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};
