import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { motion } from "framer-motion";

// ── Icons ──────────────────────────────────────────────────────────────────────

const MapIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);

const SendIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

// ── Contact info items ─────────────────────────────────────────────────────────

const INFO = [
    { icon: <MapIcon />, label: "Location", value: "Phu Yen, Vietnam" },
    { icon: <PhoneIcon />, label: "Phone", value: "+84 123 456 789" },
    { icon: <MailIcon />, label: "Email", value: "support@shofipy.com" },
];

// ── Field component ────────────────────────────────────────────────────────────

const Field = ({ label, children }) => (
    <div>
        <label
            className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            style={{ fontFamily: "'Reddit Sans', sans-serif" }}
        >
            {label}
        </label>
        {children}
    </div>
);

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white";

// ── Main ───────────────────────────────────────────────────────────────────────

export const Contact = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
                .contact-wrap * { font-family: 'Reddit Sans', sans-serif; }
            `}</style>

            <Header />

            {/* Hero banner */}
            <section className="contact-wrap relative overflow-hidden mt-[60px]">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute inset-0 opacity-25"
                    style={{ backgroundImage: "radial-gradient(circle at 15% 60%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 85% 30%, #6366f1 0%, transparent 45%)" }} />
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
                            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Support</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Contact Us
                        </h1>
                        <p className="text-base text-white/60 max-w-lg mx-auto leading-relaxed">
                            We'd love to hear from you. Get in touch with our team.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main content */}
            <section className="contact-wrap max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">

                {/* Left — contact info */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Get in touch</h2>
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        Have a question or need help? Reach out and we'll respond as soon as possible.
                    </p>

                    {/* Info cards */}
                    <div className="space-y-3 mb-10">
                        {INFO.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors duration-150"
                                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                            >
                                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map placeholder */}
                    <div
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center h-56"
                        style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                    >
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <MapIcon />
                            <span className="text-sm font-medium">Map placeholder</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right — form */}
                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div
                        className="bg-white rounded-3xl border border-slate-200 p-7"
                        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
                    >
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Send a message</h2>
                        <p className="text-sm text-slate-400 mb-7">We typically reply within 24 hours.</p>

                        <form className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="Your Name">
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="Email Address">
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>

                            <Field label="Subject">
                                <input
                                    type="text"
                                    placeholder="How can we help?"
                                    className={inputCls}
                                />
                            </Field>

                            <Field label="Message">
                                <textarea
                                    rows={5}
                                    placeholder="Tell us more about your question or issue..."
                                    className={`${inputCls} resize-none`}
                                />
                            </Field>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors duration-150"
                                style={{ boxShadow: "0 4px 14px rgba(59,130,246,0.32)" }}
                            >
                                <SendIcon />
                                Send Message
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};