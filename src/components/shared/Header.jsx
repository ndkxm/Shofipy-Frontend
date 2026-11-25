import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { logOutUser } from "../../store/actions";
import { UserMenu } from "./UserMenu";
import { Logo } from "./Logo";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Games", to: "/products" },
    { label: "Contact", to: "/contact" },
    { label: "About", to: "/about" },
];

const CartLink = ({ count }) => (
    <Link
        to="/cart"
        aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
        className="relative inline-flex items-center gap-2 h-10 px-3 rounded-md border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-slate-50 transition-colors duration-150"
    >
        <motion.span
            key={`icon-${count}`}
            initial={{ rotate: count ? -25 : 0, scale: count ? 1.3 : 1 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="inline-flex"
        >
            <ShoppingCart size={17} strokeWidth={2} aria-hidden="true" />
        </motion.span>
        <span className="relative overflow-hidden h-4 font-mono text-xs font-semibold tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={count}
                    className="block"
                    initial={{ y: 14 }}
                    animate={{ y: 0 }}
                    exit={{ y: -14 }}
                    transition={{ duration: 0.25 }}
                >
                    {String(count).padStart(2, "0")}
                </motion.span>
            </AnimatePresence>
        </span>
        {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border border-slate-900" style={{ background: "var(--color-mustard)" }} aria-hidden="true" />
        )}
    </Link>
);

export const Header = () => {
    const [navBarOpen, setNavBarOpen] = useState(false);
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartCount = cart?.length || 0;

    const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

    const handleMobileLogout = () => {
        setNavBarOpen(false);
        dispatch(logOutUser(navigate));
    };

    const mobileLink = "block px-1 py-3 text-base font-semibold border-b border-slate-200";

    // Slide away when scrolling down, come back on scroll up.
    const reduce = useReducedMotion();
    const { scrollY, scrollYProgress } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [hovered, setHovered] = useState(null);
    useMotionValueEvent(scrollY, "change", (y) => {
        const prev = scrollY.getPrevious() ?? 0;
        setHidden(!reduce && !navBarOpen && y > 160 && y > prev);
    });

    return (
        <motion.header
            animate={{ y: hidden ? "-100%" : "0%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 z-50 w-full bg-slate-50/95 border-b border-slate-900"
        >
            {/* page scroll progress */}
            <motion.div
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-px h-[3px] origin-left"
                style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, var(--color-mustard), var(--color-blue-600), var(--color-cobalt), var(--color-moss))" }}
            />
            <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between gap-6">
                <Logo />

                <nav className="hidden lg:block" aria-label="Main" onMouseLeave={() => setHovered(null)}>
                    <ul className="flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <li key={link.to} onMouseEnter={() => setHovered(link.to)}>
                                <Link
                                    to={link.to}
                                    aria-current={isActive(link.to) ? "page" : undefined}
                                    className={`relative inline-block px-3.5 py-2 text-sm font-semibold transition-colors duration-150
                                        ${isActive(link.to) ? "text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                                >
                                    {hovered === link.to && (
                                        <motion.span
                                            layoutId="nav-hover"
                                            className="absolute inset-0 rounded-md border border-slate-900"
                                            style={{ background: "var(--color-mustard-soft)" }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="relative">{link.label}</span>
                                    {isActive(link.to) && (
                                        <motion.span
                                            className="absolute left-3.5 right-3.5 -bottom-[13px] h-[3px] bg-blue-600 origin-left"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="hidden lg:flex items-center gap-3">
                    <CartLink count={cartCount} />
                    {user?.username ? (
                        <UserMenu user={user} />
                    ) : (
                        <>
                            <Link to="/signin" className="h-10 inline-flex items-center px-3 text-sm font-semibold text-slate-700 hover:text-slate-900">
                                Log in
                            </Link>
                            <Link to="/register" className="btn-accent !py-2 h-10">
                                Create account
                            </Link>
                        </>
                    )}
                </div>

                <div className="lg:hidden flex items-center gap-2">
                    <CartLink count={cartCount} />
                    <button
                        onClick={() => setNavBarOpen(!navBarOpen)}
                        aria-label={navBarOpen ? "Close menu" : "Open menu"}
                        aria-expanded={navBarOpen}
                        className="w-10 h-10 grid place-items-center rounded-md border border-slate-900 text-slate-900"
                    >
                        {navBarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {navBarOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                        className="lg:hidden border-t border-slate-900 bg-slate-50 px-5 pb-6"
                    >
                        <nav aria-label="Mobile">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setNavBarOpen(false)}
                                    className={`${mobileLink} ${isActive(link.to) ? "text-blue-600" : "text-slate-900"}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {user?.username ? (
                            <div className="pt-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-md overflow-hidden border border-slate-900 flex-shrink-0">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-blue-600 text-white text-sm font-bold grid place-items-center">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 leading-tight">{user.username}</p>
                                        <p className="label-mono text-slate-500">Signed in</p>
                                    </div>
                                </div>
                                <Link to="/profile" onClick={() => setNavBarOpen(false)} className={mobileLink}>Profile</Link>
                                {user.role === "ROLE_ADMIN" && (
                                    <Link to="/admin" onClick={() => setNavBarOpen(false)} className={mobileLink}>Dashboard</Link>
                                )}
                                <Link to="/my-orders" onClick={() => setNavBarOpen(false)} className={mobileLink}>Orders</Link>
                                <button onClick={handleMobileLogout} className="block w-full text-left px-1 py-3 text-base font-semibold text-red-600">
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 pt-5">
                                <Link to="/signin" onClick={() => setNavBarOpen(false)} className="btn-line">Log in</Link>
                                <Link to="/register" onClick={() => setNavBarOpen(false)} className="btn-accent">Create account</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
