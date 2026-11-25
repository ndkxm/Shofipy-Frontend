import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "../shared/Logo";
import { EASE, Marquee, SplitReveal } from "../shared/Motion";

const TILES = [
    { c: "var(--color-blue-600)", x: "8%", y: "18%", s: 64, r: -12, d: 6 },
    { c: "var(--color-mustard)", x: "70%", y: "12%", s: 44, r: 18, d: 5 },
    { c: "var(--color-cobalt)", x: "78%", y: "58%", s: 84, r: 8, d: 7 },
    { c: "var(--color-moss)", x: "16%", y: "70%", s: 36, r: -24, d: 5.5 },
    { c: "var(--color-lilac)", x: "48%", y: "40%", s: 28, r: 30, d: 4.5 },
];

// Split layout shared by login / register / password flows.
export const AuthShell = ({ eyebrow, title, subtitle, children, footer }) => {
    const reduce = useReducedMotion();
    return (
        <div className="min-h-dvh grid lg:grid-cols-[1fr_1.1fr] bg-slate-50">
            <aside className="hidden lg:flex flex-col justify-between bg-slate-900 text-slate-50 relative overflow-hidden">
                {/* floating key-caps */}
                {TILES.map((t, i) => (
                    <motion.div
                        key={i}
                        aria-hidden="true"
                        className="absolute rounded-md border border-slate-50/70"
                        style={{ left: t.x, top: t.y, width: t.s, height: t.s, background: t.c }}
                        initial={{ opacity: 0, scale: 0, rotate: 0 }}
                        animate={reduce ? { opacity: 0.9, scale: 1, rotate: t.r } : {
                            opacity: 0.9, scale: 1, rotate: [t.r, t.r + 10, t.r], y: [0, -18, 0],
                        }}
                        transition={{
                            opacity: { duration: 0.6, delay: 0.2 + i * 0.1 },
                            scale: { type: "spring", stiffness: 180, damping: 12, delay: 0.2 + i * 0.1 },
                            rotate: { duration: t.d, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: t.d, repeat: Infinity, ease: "easeInOut" },
                        }}
                        drag={!reduce}
                        dragSnapToOrigin
                        whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                    />
                ))}

                <div className="relative p-12"><Logo tone="light" /></div>
                <div className="relative px-12">
                    <SplitReveal
                        as="p"
                        lines={["Press", { text: "start.", className: "text-blue-500" }]}
                        className="display text-[7.5rem] xl:text-[9rem] text-slate-50"
                        delay={0.15}
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
                        className="mt-8 max-w-sm text-slate-400 leading-relaxed"
                    >
                        One account for every key you buy. Orders, receipts and codes stay in your library.
                    </motion.p>
                </div>
                <Marquee
                    items={["Instant keys", "Steam", "Secure checkout", "Your library", "Fair prices"]}
                    speed={24}
                    className="relative border-t border-slate-700 py-3 label-mono text-slate-400"
                />
            </aside>

            <main className="flex flex-col">
                <div className="lg:hidden px-5 pt-6"><Logo /></div>
                <div className="flex-1 flex items-center justify-center px-5 py-12">
                    <div className="w-full max-w-md">
                        {eyebrow && (
                            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="label-mono text-blue-700 mb-4">
                                {eyebrow}
                            </motion.p>
                        )}
                        <SplitReveal lines={[title]} className="display text-5xl md:text-6xl text-slate-900" />
                        {subtitle && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-4 text-slate-600">
                                {subtitle}
                            </motion.p>
                        )}
                        <motion.div
                            className="mt-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                        >
                            {children}
                        </motion.div>
                        {footer && <div className="mt-8 pt-6 border-t border-slate-300 text-sm text-slate-600">{footer}</div>}
                    </div>
                </div>
            </main>
        </div>
    );
};
