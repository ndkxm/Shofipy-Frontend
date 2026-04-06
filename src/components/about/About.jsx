import { FaShieldAlt, FaShippingFast, FaShoppingBag, FaTags } from "react-icons/fa"
import { Header } from "../shared/Header"
import { Link } from "react-router-dom"
import { Footer } from "../shared/Footer"
import { motion } from "framer-motion";

// ── Icons ──────────────────────────────────────────────────────────────────────

const BagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ShipIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const TagIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const SHARED_STYLE = `
    @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
    .about-wrap * { font-family: 'Reddit Sans', sans-serif; }
`;

// ── Banner ─────────────────────────────────────────────────────────────────────

export const Banner = () => (
    <section className="about-wrap relative overflow-hidden mt-[60px]">
        <style>{SHARED_STYLE}</style>

        {/* Background */}
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 10% 60%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 85% 25%, #6366f1 0%, transparent 45%)" }} />
        <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 items-center gap-14">

            {/* Text */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-white"
            >
                <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                        <BagIcon />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight">Shofipy</span>
                </Link>

                <div className="mb-5">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs font-bold text-white/80 uppercase tracking-widest">About Us</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
                    Where quality meets<br />convenience.
                </h1>

                <p className="text-base text-white/60 mb-8 leading-relaxed max-w-md">
                    We bring you the best products at great prices, making online shopping simple, fast, and enjoyable.
                </p>

                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold text-sm transition-colors duration-150"
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                >
                    Explore Products <ArrowRight />
                </Link>
            </motion.div>

            {/* Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
            >
                <img
                    src="https://images.unsplash.com/photo-1607083206968-13611e3d76db"
                    alt="shopping"
                    className="rounded-3xl w-full max-w-md object-cover"
                    style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
                />
            </motion.div>
        </div>
    </section>
);

// ── WhyChooseUs ────────────────────────────────────────────────────────────────

const FEATURES = [
    { icon: <ShipIcon />, title: "Fast Delivery", desc: "Get your orders delivered quickly and reliably to your doorstep." },
    { icon: <ShieldIcon />, title: "Secure Shopping", desc: "Your transactions and personal data are always fully protected." },
    { icon: <TagIcon />, title: "Best Prices", desc: "We offer the most competitive prices across all product categories." },
];

export const WhyChooseUs = () => (
    <section className="about-wrap bg-white py-20">
        <style>{SHARED_STYLE}</style>
        <div className="max-w-7xl mx-auto px-6">

            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center mb-14"
            >
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Why Us</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why Choose Us</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-7 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-5 group-hover:border-blue-200 transition-colors duration-150"
                            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                            {f.icon}
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mb-2">{f.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// ── OurMission ─────────────────────────────────────────────────────────────────

export const OurMission = () => (
    <section className="about-wrap bg-slate-50 py-20">
        <style>{SHARED_STYLE}</style>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

            <motion.img
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                src="https://images.unsplash.com/photo-1556742031-c6961e8560b0"
                alt="Our mission"
                className="rounded-3xl w-full object-cover"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}
            />

            <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Mission</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-5">Our Mission</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    At Shofipy, our mission is to make online shopping simple, fast, and enjoyable for everyone.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                    We carefully select high-quality products and bring them directly to you with competitive prices and reliable service.
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mt-9">
                    {[
                        { num: "10K+", label: "Products" },
                        { num: "50K+", label: "Customers" },
                        { num: "4.9★", label: "Rating" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                            <p className="text-xl font-extrabold text-slate-900">{s.num}</p>
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);

// ── CallToAction ───────────────────────────────────────────────────────────────

export const CallToAction = () => (
    <section className="about-wrap relative overflow-hidden">
        <style>{SHARED_STYLE}</style>

        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 opacity-25"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 45%)" }} />
        <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Start Today</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                    Ready to start<br />shopping?
                </h2>
                <p className="text-base text-white/60 mb-10 leading-relaxed">
                    Discover thousands of products with great prices today.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-blue-50 px-8 py-3.5 rounded-2xl font-bold text-sm transition-colors duration-150"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
                >
                    Browse Products <ArrowRight />
                </Link>
            </motion.div>
        </div>
    </section>
);
export const About = () => {
    return (
        <div>
            <Header />
            <Banner />
            <OurMission />
            <WhyChooseUs />
            <CallToAction />
            <Footer />
        </div>
    )
}